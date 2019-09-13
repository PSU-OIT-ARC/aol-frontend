import config from '@/components/map/config';
import app_config from '@/config';

import { loadModules } from 'esri-loader';
import Supercluster from 'supercluster';

let clusterIndex, clusterLayer;

const getFeaturesFromServiceLayer = (map, layer_id, where) => {
    return new Promise ((resolve, reject) => {
        const service_layer = map.findLayerById(layer_id);

        service_layer.when().then(() => {
            let query = service_layer.createQuery();
            query.where = where;

            service_layer.queryFeatures(query).then((results) => {
                resolve(results.features);
            }).catch((e)=> {
                console.error(e.message)
                reject();
            });
        });
    });
};


const createNLCDTileLayer = (map) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules(['esri/layers/TileLayer'],
                        config.dojo_options).then(([TileLayer]) => {

                let configLayer = config.layers.find(((l) => {return "nlcd" == l.id}));
                let nlcd_layer = new TileLayer({
                    url: configLayer.url,
                    id: configLayer.id,
                    visible: configLayer.visible,
                    minScale: configLayer.minScale
                });
                console.debug("Adding tile layer "+configLayer.name);
                map.add(nlcd_layer);
                resolve();
            });
        } catch (err) {
            console.error(err);
            reject(err)
        }
    });
}

const createVectorTileLayers = (map) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules(['esri/layers/VectorTileLayer'],
                        config.dojo_options).then(([VectorTileLayer]) => {

                config.layers.filter((l) => {
                    // only loading bathymetry right now
                    return l.type == "vector" && l.id == 'bathymetry'
                }).forEach((layer) => {

                    let vector_tile_layer = new VectorTileLayer({
                        url: layer.getLayerUrl(),
                        id: layer.id,
                        visible: layer.visible,
                        minScale: layer.minScale
                    })
                    console.debug("Adding vector tile layer "+layer.name);
                    map.add(vector_tile_layer);
                });
                resolve();
            });
        } catch (err) {
            console.error(err);
            reject(err)
        }
    });
};

const createFeatureServiceLayers = (map, view, component) => {
    return new Promise ((resolve, reject) => {
        let lake_point_layer;
        try {
            loadModules(['esri/layers/FeatureLayer'],
                config.dojo_options).then(([FeatureLayer]) => {

                let job = new Promise ((res, rej) => {
                    config.layers.filter((l) => {
                        // See special handling of lake_points_service_layer below
                        return l.type == "feature"
                    }).forEach((layer) => {
                        try {
                            let feature_layer = new FeatureLayer({
                                url: layer.getLayerUrl(),
                                id: layer.id,
                                visible: layer.visible,
                                outFields: layer.outFields != undefined ? layer.outFields : null,
                                minScale: layer.minScale != undefined ? layer.minScale : 0,
                                maxScale: layer.maxScale != undefined ? layer.maxScale : 0,
                                popupTemplate: layer.popupTemplate != undefined ? layer.popupTemplate : false,
                                popupEnabled: layer.popupTemplate != undefined ? true : false,
                            });

                             console.debug("Adding feature layer " + layer.name);
                             if (layer.renderer != undefined) {
                                 feature_layer.renderer = layer.renderer
                             }
                             map.add(feature_layer);
                            res();
                        } catch (err) {
                            console.error(err);
                            rej();
                        }
                    });
                })
                // Special handling of lake_points_service_layer
                job.then(() => {
                    // get features in order to create cluster layer
                    let reachcode_exp = `REACHCODE IN (${component.reachcodes.join()})`
                    getFeaturesFromServiceLayer(
                        map,
                        'lake_points_service_layer',
                        reachcode_exp
                    ).then((features) => {
                        // Add lake points with clustering
                        createClusterLayer(map, features).then((layer) => {
                            createClusterIndex(map, layer, features).then(()=> {
                                updateClusters(map, view)
                                resolve();
                            })
                        })
                    });
                });

            }); // end loadModules
        } catch (err) {
            console.error(err);
            reject(err)
        }
    });
};

/*
A lot of this was based on work in:
https://github.com/highered-esricanada/clusterlayer
*/
const createClusterLayer = (map, features) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules([
                 "esri/layers/GraphicsLayer",
            ], config.dojo_options).then(([
                GraphicsLayer,
            ]) => {
                let lake_cluster_layer = new GraphicsLayer({
                    graphics: [],
                    id: 'lake_clusters'
                })
                map.add(lake_cluster_layer);
                clusterLayer = lake_cluster_layer;
                if (!clusterLayer.featureStore) {
                    clusterLayer.featureStore = features;
                }
                resolve(lake_cluster_layer)
            })
        }
        catch (e) {
            console.error(e)
            reject()
        }
    })
}

const createClusterIndex = (map, layer, features) => {
    return new Promise ((resolve, reject) => {
        try {
            let features_as_geojson = features.map((f)=> {
                let feature = {};
                feature['geometry'] = {
                    'type': 'point',
                    'coordinates': [f.geometry.longitude, f.geometry.latitude],
                }
                feature['properties'] = f.attributes;
                return feature
            });
            const index = new Supercluster({
               radius: 150,
            }).load(features_as_geojson);
            clusterIndex = index;
            resolve(index);
        }
        catch (e) {
            console.error(e)
            reject();
        }
    });
}

const updateClusters = (map, view) => {
    return new Promise ((resolve, reject) => {
        loadModules(["esri/geometry/support/webMercatorUtils"],
            config.dojo_options).then(([webMercatorUtils,
        ]) => {
            //const clusterLayer =
            //const clusterLayer = //map.findLayerById('lake_clusters')
            //console.log(clusterLayer)
            if (clusterLayer == undefined ) {
                throw new Error("layer not ready")
            }
            if (clusterIndex == undefined) {
                throw new Error("index not ready")
            }
            let extent = webMercatorUtils.webMercatorToGeographic(view.extent);

            let bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
            let zoom = Math.floor(view.zoom);

            //let clusters = clusterLayer.cluster_index.getClusters(bbox, zoom);
            let clusters = clusterIndex.getClusters(bbox, zoom);
            let labels = [...clusters];
            // This is a little hard to read, sorry.
            Promise.all(clusters.map(convertGeoJsonToEsriFeature)).then(
                (clusters) => {
                    clusters = clusters.filter(c => c);
                    clusterLayer.graphics.removeAll();
                    clusterLayer.graphics.addMany(clusters);
                    Promise.all(labels.map(getLabelForCluster)).then(
                        labels => {
                            labels = labels.filter(l => l);
                            clusterLayer.graphics.addMany(labels);
                            resolve()
                    });
            });

        }).catch((e) => {
            reject(e)
        });
    })
};

const getLabelForCluster = (cluster) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules(["esri/Graphic"],config.dojo_options).then(([Graphic]) => {
                if (cluster.properties.point_count == undefined) resolve(); // no label needed
                let textLabel = {
                  type: "text",
                  color: "#fff",
                  text: `${cluster.properties.point_count}`,
                  xoffset: 0,
                  yoffset: -4,
                  font: {
                    size: 10,
                  }
                }
                let label = new Graphic({
                    geometry: {
                        type: "point",
                        longitude: cluster.geometry.coordinates[0],
                        latitude: cluster.geometry.coordinates[1],
                    },
                    symbol: textLabel
                });
                resolve(label)
            });
        } catch (e) {
          console.error(e);
          reject()
        }
    });
}

const convertGeoJsonToEsriFeature = (geoJson) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules([
                "esri/Graphic"
            ],config.dojo_options).then(([
                Graphic
            ]) => {
                let size = geoJson.properties.point_count != undefined ? geoJson.properties.point_count : 1;
                let clusterGraphic = new Graphic({
                    geometry: {
                        type: "point",
                        longitude: geoJson.geometry.coordinates[0],
                        latitude: geoJson.geometry.coordinates[1]
                    },
                    attributes: geoJson.properties,
                    symbol: {
                        type: 'simple-marker',
                        color: [6, 24, 206, .9], // same blue for all sizes
                        size: size,
                        outline: {
                          color: [ 128, 128, 128, 0.5 ],
                          width: "8px"
                        }
                    }
                });
                let attrs = getClusterGraphicStyles(size);
                for (let key in attrs) {
                    clusterGraphic.symbol[key] = attrs[key];
                }
                resolve(clusterGraphic)
            })
        }
        catch (e) {
            console.error(e)
            reject()
        }
    })
}

// colors can be hex strings or arrays of [r,g,b,a]
const getClusterGraphicStyles = (size) => {
    if (size <= 1) {
        return {
            size: 5,
        }
    }
    if (1 < size && size <= 2) {
        return {
            size: 10,
        }
    }
    if (2 < size && size <= 5) {
        return {
            size: 15,
        }
    }
    if (5 < size && size <= 10) {
        return {
            size: 21,
        }
    }
    if (10 < size && size <= 25) {
        return {
            size: 30,
        }
    }
    if (size > 25) {
        return {
            size: 45,
        }
    }
}

const _buffer_extent = (geom) => {
    let extent = geom.extent.clone();
    extent.expand(config.extent_buffer)
    return extent
}

const _get_offset_center = (extent, view) => {
    let sidebar = document.querySelector('.sidebar_active .lake-sidebar');
    if (app_config.is_mobile(window) || !sidebar) {
        return null;
    }
    let  screen_extent_center = view.toScreen(extent.center)
     screen_extent_center.x -= sidebar.clientWidth/2;
    return view.toMap( screen_extent_center);
}

const fitExtent = (map, view, lake) => {
    /*
    If the lake object has a cached geom attribute, goTo that extent
    Otherwise, query feature service for lake geometry using reachcode.
    */
    return new Promise((resolve) => {
        if (map == null || view == null) {
            console.warn("Map is not loaded. Cannot fit bounds.");
            return
        }

        if (lake == undefined) {
            console.debug('No lake provided to fitBounds:')
            return
        }

        if (lake.cached_geom == undefined) {
            console.debug('Fetching geometry from ArcGIS online')
            let lake_layer = map.findLayerById('lake_bbox_service_layer');
            let query = lake_layer.createQuery();
            query.where = `REACHCODE = ${lake.reachcode}`;
            query.maxRecordCountFactor = 4;
            lake_layer.queryFeatures(query).then((response) => {
                if (response.features.length) {
                    let geom = response.features[0].geometry;
                    console.debug('Caching lake geom returned from ARCGIS online query by reachcode')
                    lake.cached_geom = geom;
                    let extent = _buffer_extent(geom)
                    view.goTo(extent).then(()=>{
                        let offset = _get_offset_center(extent, view);
                        if (offset) {
                            view.goTo({center: offset}, {animate: false});
                        }
                        resolve(view);
                   }).catch((e) => {
                       console.error(e.message)
                   });
               }
           }).catch((e) => {
               console.error(e.message)
           });
        }
        else {
            console.debug('fitBounds using cached geom')
            let extent = _buffer_extent(lake.cached_geom);
            view.goTo(extent).then(()=>{
                let offset = _get_offset_center(extent, view);
                if (offset) {
                    view.goTo({center: offset}, {animate: false});
                }
                resolve(view);
            }).catch((e) => {
                console.error(e.message)
            });
        }
    });
};

const checkExtent = (view, initialExtent) => {
// thanks to:
// https://community.esri.com/thread/229431-getting-mapview-to-stay-within-bounds
  let currentCenter = view.extent.center;
  if (!initialExtent.contains(currentCenter)) {

    let newCenter = view.extent.center;

    if (currentCenter.x < initialExtent.xmin) {
      newCenter.x = initialExtent.xmin;
    }
    if (currentCenter.x > initialExtent.xmax) {
      newCenter.x = initialExtent.xmax;
    }
    if (currentCenter.y < initialExtent.ymin) {
      newCenter.y = initialExtent.ymin;
    }
    if (currentCenter.y > initialExtent.ymax) {
      newCenter.y = initialExtent.ymax;
    }
    view.goTo(newCenter, {duration: 0});
  }
}

export {
    createNLCDTileLayer,
    createVectorTileLayers,
    createFeatureServiceLayers,
    createClusterIndex,
    updateClusters,
    convertGeoJsonToEsriFeature,
    clusterIndex,
    clusterLayer,
    checkExtent,
    fitExtent
}

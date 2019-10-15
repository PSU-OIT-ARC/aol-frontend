import { loadModules } from 'esri-loader';
import Supercluster from 'supercluster';

import app_config from '@/config';
import config from '@/components/map/config';


let clusterIndex = null;
let clusterLayer = null;


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
                    return l.type == "vector"
                }).forEach((layer) => {

                    let vector_tile_layer = new VectorTileLayer({
                        url: layer.getLayerUrl(),
                        id: layer.id,
                        visible: layer.visible,
                        minScale: layer.minScale,
                        maxScale: layer.maxScale
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

const createFeatureServiceLayers = (map, view, reachcodes) => {
    return new Promise ((resolve, reject) => {
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
                    getFeaturesFromServiceLayer(
                        map,
                        'lake_points_service_layer',
                        `REACHCODE IN (${reachcodes.join()})`
                    ).then((features) => {
                        // Add lake points with clustering
                        createClusterLayer(map, features).then((layer) => {
                            createClusterIndex(map, layer, features).then(()=> {
                                updateClusters(map, view);
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

const filterClusters = (map, view, lakes) => {
    let reachcodes = lakes.map((lake) => {return lake.reachcode});
    let features = clusterLayer.featureStore.filter((feature) => {
        return reachcodes.indexOf(feature.attributes.REACHCODE) > -1;
    });

    createClusterIndex(map, clusterLayer, features).then(() => {
        updateClusters(map, view);
    });
};

const updateClusters = (map, view) => {
    return new Promise ((resolve, reject) => {
        loadModules(["esri/geometry/support/webMercatorUtils"],
            config.dojo_options).then(([webMercatorUtils,
        ]) => {
            //const clusterLayer =
            //const clusterLayer = //map.findLayerById('lake_clusters')
            //console.log(clusterLayer)
            if (clusterLayer == undefined ) {
                // throw new Error("layer not ready")
                console.warn("Cluster layer is not yet defined");
                resolve();
                return
            }
            if (clusterIndex == undefined) {
                // throw new Error("index not ready")
                console.warn("Cluster index is not yet defined");
                resolve();
                return
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

const prepareExtent = (view, baseExtent) => {
    // Massages the baseExtent according to domain-specific rules.
    //
    let extent = baseExtent.clone();

    // expands the given extent using a fudge factor
    extent.expand(config.extent_buffer);

    // offset the given extent by an amount proportional
    // to the width (in screen terms) of an active sidebar.
    let sidebar = document.querySelector('.sidebar_active .sidebar-container');
    let map = document.querySelector('.sidebar_active .map-container');

    if (sidebar != null && !app_config.is_mobile(window) ) {
        let dx = (extent.width / view.width) * sidebar.clientWidth;

        if (map.clientWidth >= sidebar.clientWidth) {
            extent.offset(-dx, 0, 0);
        }
    }

    return extent;
}

const checkExtent = (view, initialExtent) => {
    // Enforces current view center point to be contained by
    // the extentobject given by initialExtent.
    //
    // Refs: https://community.esri.com/thread/229431-getting-mapview-to-stay-within-bounds
    //
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
    convertGeoJsonToEsriFeature,
    clusterIndex,
    filterClusters,
    updateClusters,
    prepareExtent,
    checkExtent
}

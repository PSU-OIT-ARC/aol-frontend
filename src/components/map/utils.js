import config from '@/components/map/config';
import { loadModules } from 'esri-loader';
import Supercluster from 'supercluster';

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
                console.info("Adding tile layer "+configLayer.name);
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

                config.layers.filter((l) => {return l.type == "vector"}).forEach((layer) => {

                    let vector_tile_layer = new VectorTileLayer({
                        url: layer.getLayerUrl(),
                        id: layer.id,
                        visible: layer.visible,
                        minScale: layer.minScale
                    })
                    console.info("Adding vector tile layer "+layer.name);
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
                                renderer: layer.renderer != undefined ? layer.renderer : null,
                                minScale: layer.minScale != undefined ? layer.minScale : 0,
                                maxScale: layer.maxScale != undefined ? layer.maxScale : 0,
                                popupTemplate: layer.popupTemplate != undefined ? layer.popupTemplate : false,
                                popupEnabled: layer.popupTemplate != undefined ? true : false,
                            });
                             console.info("Adding feature layer " + layer.name);
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
                            })
                        })
                    });
                });
            }); // end loadModules
            resolve();
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
                /*let lake_cluster_label_layer = new GraphicsLayer({
                    graphics: [],
                    id: 'lake_clusters_labels'
                });
                map.add(lake_cluster_label_layer);*/
                resolve(lake_cluster_layer)
            })
        }
        catch (e) {
            console.log(e)
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
               //maxZoom: 18
            }).load(features_as_geojson);
            // stash for retrieval
            layer.cluster_index = index;
            if (!layer.featureStore) {
                layer.featureStore = features;
            }
            resolve(index);
        }
        catch (e) {
            console.log(e)
            reject();
        }
    });
}

const updateClusters = (map, view) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules([
                "esri/geometry/support/webMercatorUtils",
                "esri/Graphic"
            ],config.dojo_options).then(([
                webMercatorUtils,
                Graphic
            ]) => {
                const clusterLayer = map.findLayerById('lake_clusters')

                let extent = webMercatorUtils.webMercatorToGeographic(view.extent);

                let bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
                let zoom = Math.floor(view.zoom);

                try {
                    let clusters = clusterLayer.cluster_index.getClusters(bbox, zoom);

                    let clusterGraphics = [];
                    clusters.forEach((g) => {
                        let clusterGraphic = convertGeoJsonToEsriFeature(g, Graphic)
                        if (clusterGraphic) {
                            clusterGraphics.push(clusterGraphic)
                        }
                    })
                    clusterLayer.graphics.removeAll();
                    clusterLayer.graphics.addMany(clusterGraphics);

                    let labels = [];
                    clusters.forEach((c) => {
                        let label = getLabelForCluster(c, Graphic)
                        if (label) {
                            labels.push(label);
                        }
                    });
                    clusterLayer.graphics.addMany(labels);
                    resolve()
                }
                catch (e) {
                    console.log(e)
                    reject();
                }
            });
        }
        catch (e) {
            console.log(e)
            reject()
        }
    })
};

const getLabelForCluster = (cluster, Graphic) => {
    if (cluster.properties.point_count == undefined) return; // no label needed
    let textLabel = {
      type: "text",
      color: "#333",
      text: `${cluster.properties.point_count}`,
      xoffset: 0,
      yoffset: -2,
      font: {
        size: 10,
      }
    };
    try {
      return new Graphic(
        {
          geometry: {
            type: "point",
            longitude: cluster.geometry.coordinates[0],
            latitude: cluster.geometry.coordinates[1],
          },
          symbol: textLabel
        }
      );
    } catch (e) {
      console.log(e);
    }
}

const convertGeoJsonToEsriFeature = (geoJson, Graphic) => {
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
            color: 'yellow',
            size: size,
            outline: null
        }
    });
    let attrs = getClusterGraphicStyles(size);
    for (let key in attrs) {
        clusterGraphic.symbol[key] = attrs[key];
    }
    return clusterGraphic;
}

// colors can be hex strings or arrays of [r,g,b,a]
const getClusterGraphicStyles = (size) => {
    if (size <= 1) {
        return {
            size: 5,
            color: [250, 35, 35, 0.5] // red
        }
    }
    if (1 < size && size <= 2) {
        return {
            size: 10,
            color: [246, 136, 27, 0.5]// orange
        }
    }
    if (2 < size && size <= 5) {
        return {
            size: 15,
            color: [27, 237, 171, 0.4] // blue-green
        }
    }
    if (5 < size && size <= 10) {
        return {
            size: 21,
            color: [65, 27, 237, 0.4] // purple
        }
    }
    if (10 < size && size <= 25) {
        return {
            size: 30,
            color: [237, 27, 199, 0.4] // pink
        }
    }
    if (size > 25) {
        return {
            size: 45,
            color: [27, 94, 237, 0.4] // blue
        }
    }
}

export {
    createNLCDTileLayer,
    createVectorTileLayers,
    createFeatureServiceLayers,
    createClusterIndex,
    updateClusters
}

import config from '@/components/map/config';
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
    console.log('creating cluster layer')
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
            console.log(e)
            reject()
        }
    })
}

const createClusterIndex = (map, layer, features) => {
    console.log('creating cluster index')
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
            console.log(e)
            reject();
        }
    });
}

const updateClusters = (map, view) => {
    console.log('update clusters called')
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
                  color: "#333",
                  text: `${cluster.properties.point_count}`,
                  xoffset: 0,
                  yoffset: -2,
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
          console.log(e);
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
                        color: 'yellow',
                        size: size,
                        outline: null
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
            console.log(e)
            reject()
        }
    })
}

// colors can be hex strings or arrays of [r,g,b,a]
const getClusterGraphicStyles = (size) => {
    if (size <= 1) {
        return {
            size: 5,
            color: [237, 27, 199, 0.7] // pink
        }
    }
    if (1 < size && size <= 2) {
        return {
            size: 10,
            color: [65, 27, 237, 0.4] // purple
        }
    }
    if (2 < size && size <= 5) {
        return {
            size: 15,
            color: [27, 237, 171, 0.7] // blue-green
        }
    }
    if (5 < size && size <= 10) {
        return {
            size: 21,
            color: [246, 136, 27, 0.5]// orange
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
    updateClusters,
    convertGeoJsonToEsriFeature,
    clusterIndex,
    clusterLayer
}

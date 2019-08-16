import config from '@/components/map/config';
import { loadModules } from 'esri-loader';


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
            });
            resolve();
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
            });
            resolve();
        } catch (err) {
            console.error(err);
            reject(err)
        }
    });
};

const createFeatureServiceLayers = (map, component) => {
    return new Promise ((resolve, reject) => {
        let lake_point_layer;
        try {
            loadModules(['esri/layers/FeatureLayer'],
                        config.dojo_options).then(([FeatureLayer]) => {

                let job = new Promise ((res, rej) => {
                    config.layers.filter((l) => {return l.type == "feature"}).forEach((layer) => {
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
                            // See special handling of lake_points_service_layer below
                            if (layer.id == 'lake_points_service_layer') {
                              lake_point_layer = feature_layer;
                            }
                            else {
                              console.info("Adding feature layer "+layer.name);
                              map.add(feature_layer);
                            }
                            res();
                        } catch (err) {
                            console.error(err);
                            rej();
                        }
                    });
                })
                // Special handling of lake_points_service_layer
                job.then(() => {
                    map.add(lake_point_layer);
                    let reachcodesLimitStmt = "(" + component.reachcodes.join(',') + ")";
                    getFeaturesFromServiceLayer(map,
                                                'lake_points_service_layer',
                                                "REACHCODE IN "+reachcodesLimitStmt).then(
                        (features) => {
                            // Add lake points with clustering
                            createClusterLayer(map, features);
                            let exp = `REACHCODE IN (${component.reachcodes.join()})`
                            lake_point_layer.definitionExpression = exp;
                            //createLakePointGraphicLayer(map, features);
                        }
                    );
                });
            }); // end loadModules
            resolve();
        } catch (err) {
            console.error(err);
            reject(err)
        }
    });
};

const createFeatureLayerViews = (map) => {
  return new Promise ((resolve, reject) => {
    try {
      loadModules(['esri/views/layers/FeatureLayerView'],
                  config.dojo_options).then((
                    [FeatureLayerView]) => {
        const points_layer_view = new FeatureLayerView({
            layer: map.findLayerById('lake_points_service_layer')
        });
      }); //end loadModules
      resolve();
    } catch (err) {
      console.error(err);
      reject(err)
    }
  }); //end promise
}

const createClusterLayer = (map, features) => {
    return new Promise ((resolve, reject) => {
        try {
            loadModules(["esri/symbols/SimpleMarkerSymbol",
                         "esri/symbols/SimpleLineSymbol",
                         "esri/symbols/SimpleFillSymbol",
                         "esri/renderers/ClassBreaksRenderer",
                         "fcl/FlareClusterLayer_v4"
                        ], config.dojo_options).then(([
                            SimpleMarkerSymbol,
                            SimpleLineSymbol,
                            SimpleFillSymbol,
                            ClassBreaksRenderer,
                            fcl
                        ]) => {

                // transform features objects to graphics objects
                let data = features.map((f) => {
                    f.x = f.geometry.longitude;
                    f.y = f.geometry.latitude;
                    return f;
                });

                let defaultSym = new SimpleMarkerSymbol({
                    size: 6,
                    color: "#FF0000",
                    outline: null
                });

                let clusterRenderer = new ClassBreaksRenderer({
                    defaultSymbol: defaultSym
                });
                clusterRenderer.field = "clusterCount";

                let smSymbol = new SimpleMarkerSymbol({
                    size: 22,
                    color: [255, 204, 102, 0.9],
                    outline: new SimpleLineSymbol({
                        color: [221, 159, 34, 0.9]
                    }),
                });

                let mdSymbol = new SimpleMarkerSymbol({
                    size: 24,
                    color: [102, 204, 255, 0.9],
                    outline: new SimpleLineSymbol({
                        color: [82, 163, 204, 0.9]
                    }),
                });

                let lgSymbol = new SimpleMarkerSymbol({
                    size: 28,
                    color: [51, 204, 51, 0.9],
                    outline: new SimpleLineSymbol({
                        color: [41, 163, 41, 0.9]
                    }),
                });

                let xlSymbol = new SimpleMarkerSymbol({
                    size: 32,
                    color: [250, 65, 74, 0.9],
                    outline: new SimpleLineSymbol({
                        color: [200, 52, 59, 0.9]
                    }),
                });

                clusterRenderer.addClassBreakInfo(0, 19, smSymbol);
                clusterRenderer.addClassBreakInfo(20, 150, mdSymbol);
                clusterRenderer.addClassBreakInfo(151, 1000, lgSymbol);
                clusterRenderer.addClassBreakInfo(1001, Infinity, xlSymbol);

                let options = {
                    id: "lake_clusters",
                    clusterRenderer: clusterRenderer,
                    displayFlares: false,
                    clusterRatio: config.clusterRatio,
                    clusterToScale: config.clusterToScale,
                    clusterMinCount: config.clusterMinCount,
                    data: data
                }

                let clusterLayer = new fcl.FlareClusterLayer(options);
                map.add(clusterLayer);
                clusterLayer.when().then(()=> {
                    console.info("Loaded cluster layer");
                    //resolve(clusterLayer);
                }).catch((e)=> {
                    console.error(e.message)
                    //reject();
                });
            }); //end loadModules
            resolve();
        } catch (err) {
            console.error(err);
            reject(err)
        }
    });
};

export {
    createNLCDTileLayer,
    createVectorTileLayers,
    createFeatureServiceLayers,
    createFeatureLayerViews
}

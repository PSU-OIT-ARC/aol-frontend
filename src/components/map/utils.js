import config from '@/components/map/config';

const getFeaturesFromServiceLayer = (map, layer_id) => {
  return new Promise ((resolve) => {
    const service_layer = map.findLayerById(layer_id);

    service_layer.when().then(() => {
      let query = service_layer.createQuery()
      query.maxRecordCountFactor = 4; // get 4 * maxRecordCount (2000)
      query.maxRecordCount = 10000 // does this work?

      service_layer.queryFeatures(query).then((results) => {
           resolve(results.features);
      }).catch((e)=> {
        console.log('query error: ' + e)
      });
    });
  });
};

const createClusterLayer = (
    map,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    ClassBreaksRenderer, fcl
  ) => {
    return new Promise ((resolve) => {
      getFeaturesFromServiceLayer(
        map, 'lake_points_service_layer').then(
        (features) => {
        // filter out lakes to show on map (TEMP CODE)
        let active_lakes = features.filter((f) => {
          let rc = f.attributes.REACHCODE
          return config.cms_reachcodes.indexOf(rc) > -1
        });

        // transform features objects to graphics objects
        let data = active_lakes.map((f) => {
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
          resolve(clusterLayer)
        })
    })
  }); //end Promise
};

export {
  getFeaturesFromServiceLayer,
  createClusterLayer
}

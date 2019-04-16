
const utils = {
    checkMarkerOrBounds: (e, layers=[], clusters_enabled=false) => {
        let selected;
        let pixel = e.pixel;
        // see hitTolerance for more fuzzing
        e.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (clusters_enabled) {
                if (feature.get('features') && feature.get('features').length > 1) {
                    return // cluster handled by doubleclick
                }
                selected = feature.getProperties().features[0];
            }
            else {
                selected = feature;
            }
        },
        {
          layerFilter: (layer_candidate) => {
            return layers.find(l => l == layer_candidate.get('id'))
        }
      });
      return selected;
    },
    zoomToCluster: (e) => {
        console.log("I am zooming to the cluster's features' extent")
        /*
        let cluster_feature = e.map.forEachFeatureAtPixel(
            e.pixel, (feature, layer) => {
                return feature;
            });
        if (cluster_feature) {
        let features = cluster_feature.get('features');
        if (features && features.length > 1) {
            let extent = [];
            features.forEach((f) => {
                extent.push(f.getGeometry().getExtent());
            });
            let bounds = olExtent.boundingExtent(extent)
            e.map.getView().fit(bounds);
            e.map.getView().setCenter(e.coordinate)
        }
      }
      */
    },
    selectFeatureLayer: (selected_layer, layers=[]) => {
        layers.map((layer) => {
            if (layer.getProperties()['id'] != selected_layer) {
              layer.setVisible(false);
            }
            else if (layer.getProperties()['id'] == selected_layer) {
              layer.setVisible(true);
            }
        });
    },
    mapToRange: (value, in_min, in_max, out_min, out_max) => {
        return (value - in_min) *
            (out_max - out_min) /
            (in_max - in_min) + out_min;
    },
}
export default utils;

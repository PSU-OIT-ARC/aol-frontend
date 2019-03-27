import { createStyle } from 'vuelayers/lib/ol-ext';


// need to handshake instead
const token = `TzYZhy_QyEHxjyNzYEcWOrNFq6MnEAuWQZy9QXAIX5Eq-BGAMPGHrtkRIMxUWVwZ\
VocGX4Z6YxFYMG1dweLi9-GD2vmM_eigxx3w_th4j6wW_wKz_YTivzxr4GJUZIyll2\
z9klp1ivyKax3CkobISZLXYnOjYwNnMpUzYFD_XgJ00K5M3xvtXfNk7_KwIgBUDD2E\
jYy9cLG1Lf0CcZ9r_WjDhE5Cch3nrT7LQmqAMsILKlA-txKddGs6DZTpL8xRMVIV_n\
NXrBUMH3h7OK14L-cGFP4ntKBVPwJqL08HtrM`;

const ArcGisOnlineServicesBaseUrl = "https://services.arcgisonline.com";
const ArcGisOnlineTilesBaseUrl = "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY";
const rest_path = "arcgis/rest/services";

const ArcGisOnlineServicesUrl = `${ArcGisOnlineServicesBaseUrl}/${rest_path}`;
const ArcGisOnlineTilesUrl = `${ArcGisOnlineTilesBaseUrl}/${rest_path}`;

const getLayerUrl = function () {
    return `${ArcGisOnlineTilesUrl}/${this.AGOLName}/`+
        `VectorTileServer/tile/{z}/{y}/{x}.pbf?token=${token}`;
};

const getStyleUrl = function () {
    return `${ArcGisOnlineTilesUrl}/${this.AGOLName}/` +
        `VectorTileServer/resources/styles/root.json?f=json&token=${token}`;
};

const getSpriteUrl = function () {
    return `${ArcGisOnlineTilesUrl}/${this.AGOLName}/` +
        `VectorTileServer/resources/sprites/sprite?f=json&token=${token}`;
};

const config = {
    token: token,
    map_center: [-122.841856, 44.002925],
    bounds_padding: 120,
    zoom: 8.5,
    cluster_distance: 150,
    cluster_max_zoom: 10,
    ArcGisOnlineServicesUrl: ArcGisOnlineServicesUrl,
    ArcGisOnlineTilesUrl: ArcGisOnlineTilesUrl,
    baseLayers: [
      {
        id: "gray",
        visible: true,
        url: `${ArcGisOnlineServicesUrl}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
        extent: undefined
      },
      {
        id: "nlcd",
        visible: true,
        url: `${ArcGisOnlineTilesUrl}/Hillshade_NLCD/MapServer/tile/{z}/{y}/{x}?token=${token}`,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997],
      }
    ],
    featureLayers: [
      {
        id: 'publand',
        visible: false,
        AGOLName: 'Vector_Publands',
        getUrl: getLayerUrl,
        getStyleUrl: getStyleUrl,
        getSpriteUrl: getSpriteUrl,
        zIndex: 6,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997]
      },
      {
        id: 'nopubland',
        visible: true,
        AGOLName: 'Vector_NoPub',
        getUrl: getLayerUrl,
        getStyleUrl: getStyleUrl,
        getSpriteUrl: getSpriteUrl,
        zIndex: 7,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997]
      },
      {
        id: 'bathymetry',
        visible: true,
        zIndex: 8,
        AGOLName: 'Vector_Bathy',
        getUrl: getLayerUrl,
        getStyleUrl: getStyleUrl,
        getSpriteUrl: getSpriteUrl,
        extent: undefined//[-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997]
      }
    ],
    clusterStyle: createStyle({
        imageRadius: 10,
        strokeColor: '#fff',
        fillColor: 'blue',
        text: '',
        textFillColor: '#fff',
    }),
    pointStyle : createStyle({
        imageRadius: 4,
        strokeColor: '#fff',
        fillColor: 'royalblue',
    }),
    marker: {
        radius: 3,
        color: 'royalblue',
        fill: true,
        fillColor: 'blue',
        fillOpacity: 1
    },
    polygon: {
        stroke: "yellow",
        fill: "rgba(0,0,0,0.1)",
        width: 1
    },
}

export default config;

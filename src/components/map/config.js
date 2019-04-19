
const token = `6CE9JiJwCSzUJpcVWLNTySpjuxBoopgKcQqLOJ04MmINJYtBH5Wd5XvMWLrtcwWS\
1TCVw4R7ZX4s04aflAKhKo28tB-wT6PBIvZEVdehhRn_EC8QGNh1AXM4K2CowLgusSVAzNlo228OUIZ\
Y1e5ZUsSMDlaZPUA5IgmK7cE1F93IHm4TQLrqlyHQiY8LX9KC6H6mQeci9hFnjvCnzfHYyw`;

const ArcGisOnlineServicesBaseUrl = "https://services.arcgisonline.com";
const ArcGisOnlineTilesBaseUrl = "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY";
const rest_path = "arcgis/rest/services";

const ArcGisOnlineServicesUrl = `${ArcGisOnlineServicesBaseUrl}/${rest_path}`;
const ArcGisOnlineTilesUrl = `${ArcGisOnlineTilesBaseUrl}/${rest_path}`;


const getLayerUrl = function () {
    return `${ArcGisOnlineTilesUrl}/${this.AGOLName}/`+
        `VectorTileServer`;
};

const config = {
    token: token,
    lake_marker_fields: [
        {
            name: "ObjectID",
            alias: "id",
            type: "oid"
        },
        {
            name: "name",
            alias: "name",
            type: "string"
        },
        {
            name: "reachcode",
            alias: "reachcode",
            type: "integer"
        }
    ],
    map_center: [-122.841856, 44.002925],
    zoom: 9,
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
        url: `${ArcGisOnlineTilesUrl}/Hillshade_NLCD/MapServer`, //tile/{z}/{y}/{x}?token=${token}`,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997],
      }
    ],
    vectorTileLayers: [
      {
        id: 'publand',
        visible: false,
        minScale: 0,
        AGOLName: 'Vector_Publands',
        getLayerUrl: getLayerUrl,
      },

      {
        id: 'nopubland',
        visible: true,
        AGOLName: 'Vector_NoPub',
        minScale: 0,
        getLayerUrl: getLayerUrl,
      },

      {
        id: 'bathymetry',
        visible: true,
        zIndex: 8,
        minScale: 577790.5542885,
        AGOLName: 'Vector_Bath_Test_2',
        getLayerUrl: getLayerUrl,
      }
    ],
}

export default config;



const backend_url = process.env.VUE_APP_BACKEND_URL;

const access_token = `C93ORqYdWvUajz9fbAHAwq64ZzG6iWHI--VGjAhqVW4XVTjAgSpiBsAGE8grM28\
OGDTM4Dd8eFBKMU-0dfylpNMhMjHH7wpM71PZG_wOWHYJkCyxyeyP7-DKvfMheQU0r3kSpxWRgff7c\
lEvElhcew..`;

const token = `CGixBe3rUT8bM2Vp32X0iTX9Gy3rxLbzyrcqUUPWV7zMp7tRKbFFYQpqDd_pmf6w\
HUd9BoJ0RzgrUAqqQHXLBA-HOIjQ4BS9cV5whnERL3U7xb6OQz7gI6jq7FQDv9NI9blc5VbCdn0axtk\
gIPltMS-VeJUc7rM8UsCZClE_X3rDvVeQfzBQIoStKZqxsUHPRr_Iuqx1ZeiYtCcV4wxTE3H4OZYP2E\
xuLkEwo8lgnT7Xn14fr6JVKYipvGXxUMSV`;

const AGOL_GROUP_ID = '6Miy5NqQWjMYTGFY';
const REST_PATH = "arcgis/rest/services";
const ArcGisOnlineServicesBaseUrl = `https://services2.arcgis.com/${AGOL_GROUP_ID}`;
const ArcGisOnlineTilesBaseUrl = `https://tiles.arcgis.com/tiles/${AGOL_GROUP_ID}`;

const ArcGisOnlineServicesUrl = `${ArcGisOnlineServicesBaseUrl}/${REST_PATH}`;
const ArcGisOnlineTilesUrl = `${ArcGisOnlineTilesBaseUrl}/${REST_PATH}`;


const getVectorTileLayerUrl = function () {
    return `${ArcGisOnlineTilesUrl}/${this.AGOLName}/`+
        `VectorTileServer`;
};

const getServiceLayerUrl = function () {
    return `${ArcGisOnlineServicesUrl}/${this.AGOLName}/`+
        `FeatureServer`;
};

const config = {
    dojo_options:  {
        dojoConfig: {
            async: true,
            packages: [
                {
                    location: '/amd',
                    name: 'fcl'
                }]
            }
    },

    backend_url: backend_url,

    token: token,
    access_token: access_token,
    map_center: [-122.841856, 44.002925],
    zoom: 9,
    clusterRatio: 130,
    clusterToScale: 53672,
    clusterMinCount: 4,
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
            type: "string"
        }
    ],

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
    featureServiceLayers: [
        {
            id: 'lake_points_service_layer',
            AGOLName: 'OR_Lake_Points_test',
            getLayerUrl: getServiceLayerUrl,
            visible: false
        },
        {
            id:'lake_bbox_service_layer',
            AGOLName: 'NHDH_bounding_selection_shp',
            getLayerUrl: getServiceLayerUrl,
            visible: false
        }
    ],
    vectorTileLayers: [
      {
        id: 'publand',
        visible: false,
        minScale: 0,
        AGOLName: 'Vector_Publands',
        getLayerUrl: getVectorTileLayerUrl,
      },

      {
        id: 'nopubland',
        visible: true,
        AGOLName: 'Vector_NoPub',
        minScale: 0,
        getLayerUrl: getVectorTileLayerUrl,
      },

      {
        id: 'bathymetry',
        visible: true,
        zIndex: 8,
        minScale: 577790.5542885,
        AGOLName: 'Vector_Bath_Test_2',
        getLayerUrl: getVectorTileLayerUrl,
      }
    ]
}

export default config;

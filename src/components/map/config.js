

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
    ],
    // Dummy data
    cms_reachcodes: [
        "18010202001156", "17100203010428", "17100302015008", "17100207000083",
        "17070301000906", "17120004002775", "17050201000974", "17090003001473", "17100206000579", "17100304000652", "17090004007099", "17070306002028", "17100301001015", "17100207000080", "17100302001316", "17080006006562", "17070103003760", "17100206000578", "17100301005078", "17090002003761", "18020001001157", "17050116008513", "17090004007144", "17070301000895",
        "18010201000427", "17090002000506", "17070302000357", "17100306000356", "17100207011122", "17120007341605", "17080006006735", "17070301000888", "17100301005606",
        "17100207000084", "17100304000657", "17050203006118", "17070202005214", "17120005001399", "17070301000853", "17100207011137", "17090011000850", "17070301000856", "17100301005580", "17090001001071", "17090004007106", "17100206000577", "17080001017715", "17100301001019",
        "17070302000350", "17060105000756", "17100205005490", "17100304000653", "17100304000654", "17100207000085", "17070301000862", "17090011000882", "17100308006269", "17100207011108", "18010204002174",
        "17090012003938", "17120001004352", "17090011000864", "18010203000446", "17120007341479", "17070306012045", "18010202001175", "18010203000410", "17100203010611", "17100206015321", "17100301001021", "17090010004615", "17100302015096", "17050203001867", "17090001005308", "17100308000768", "18010202001165", "17090003006436", "17090007000765", "17070301000863",
        "18010206001019", "17100206015348", "18010206001001",
        "17070201001692", "17120001004559", "17050119001844", "17120009001467", "17090005000775", "17100205005366", "17070103004024", "17100307006376", "17100307006369", "17100205000491", "18010201000426", "17060105000771", "17090004001133", "17060105000773", "17090007000770", "17070306002041", "17120004003024", "17060104001358", "17090007000783",
        "17090005012350", "17120001004500", "17100206000581",
        "17100304000659", "17090004006177", "17100310007332", "17090003001442", "17100311011257", "17100207011101", "17100207000082", "17070306011851", "17100301001024", "17100302015198", "17100301005573", "17100201000104", "17090012006623", "17100203000740", "17080006006591", "17090004007103", "17070301000912", "17070301005459", "18010204002235", "17100309000673",
        "17070201001696", "18010204002341", "17100301001018", "17090012000320", "17120005004769", "17070302001212", "17100201000712", "17070301000834", "17100205005558"
    ]
}

export default config;

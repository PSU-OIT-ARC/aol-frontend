

const backend_url = process.env.VUE_APP_API_URL;
const max_search_results = 5
const LOADING = 'loading';

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

const OregonMarineBoardFeatureLayerUrl = `https://services.arcgis.com/\
uUvqNMGPm7axC2dD/arcgis/rest/services/Boating_Access_Sites/FeatureServer`;

const MarineBoardTemplate = {
    title: "{FACILNM} at {WATERBODYNM}",
    content: [
      {
        type: "fields",

        fieldInfos: [
          {
            fieldName: "FACILNM",
            label: "Facility Name"
          },
          {
            fieldName: "WATERBODYNM",
            label: "Waterbody name",
          },
          {
            fieldName: "FACILMGR",
            label: "Facility Manager",
          },
          {
            fieldName: "TELEPHONE",
            label: "Telephone number",
          },
          {
            fieldName: "USEFEE",
            label: "Use fee",
          },

        ]
      },
      {
        type: "media",
        mediaInfos: [{
            title: "Services",
            type: "image",
            value: {
              sourceURL: "{SERVICESURL}"
            }
        }]
      }
    ]
  };

const config = {
    dojo_options:  {
        dojoConfig: {
            async: true
        }
    },
    backend_url: backend_url,
    max_search_results: max_search_results,

    //map_center: [-122.841856, 44.002925],
    map_center: [-121.7, 44.1],
    zoom: 8,
    maxZoom: 15,
    ArcGisOnlineServicesUrl: ArcGisOnlineServicesUrl,
    ArcGisOnlineTilesUrl: ArcGisOnlineTilesUrl,
    layers: [
        {
            id: "nlcd",
            type: "base",
            name: "Hillshade",
            visible: false,
            url: `${ArcGisOnlineTilesUrl}/Hillshade_NLCD/MapServer`,
                  //tile/{z}/{y}/{x}?token=${token}`,
            extent: [-13847487.234310532, 5367239.26625923,
                     -13539022.354823876, 5532200.785834997],
            input_type: "checkbox",
            input_group: "hillshade",
        },

        {
            id: 'lake_points_service_layer',
            type: "feature",
            name: "Lake Points",
            outFields: ["*"],
            visible: false,
            renderer: {
              type: "simple",
              symbol: {
                //style: "circle",
                type: 'simple-marker',
                color: "yellow",
                size: "6px",
                outline: null
              }
            },
            AGOLName: 'OR_Lake_Points_test',
            getLayerUrl: getServiceLayerUrl,
        },
        {
            id:'lake_bbox_service_layer',
            type: "feature",
            name: "Lake Bounding Boxes",
            visible: true,
            outFields: ["*"],
            renderer: {
              type: "simple",
              symbol: {
                color: [100, 100, 100, 0.1], // currently transluscent for debug
                type: "simple-fill",
                style: "solid",
                outline: null
              },
            },
            AGOLName: 'NHDH_bounding_selection_shp',
            getLayerUrl: getServiceLayerUrl,
        },
        {
            id: 'marine_board_facilities_service_layer',
            type: "feature",
            name: "Marine Board Facilities",
            visible: true,
            minScale: 288447,
            popupTemplate: MarineBoardTemplate,
            getLayerUrl: () => OregonMarineBoardFeatureLayerUrl,
        },
        {
            id: 'publand',
            type: "vector",
            name: 'Ownership',
            visible: false,
            minScale: 0,
            AGOLName: 'Vector_Publands',
            getLayerUrl: getVectorTileLayerUrl,
            input_type: 'radio',
            input_group: 'lands',
        },
        {
            id: 'nopubland',
            type: "vector",
            name: 'Naturalistic',
            visible: false,
            AGOLName: 'Vector_NoPub',
            minScale: 0,
            getLayerUrl: getVectorTileLayerUrl,
            input_type: 'radio',
            input_group: 'lands',
        },
        {
            id: 'bathymetry',
            type: "vector",
            name: 'Bathymetry',
            visible: true,
            zIndex: 8,
            minScale: 577790.5542885,
            AGOLName: 'Vector_Bath_Test_2',
            getLayerUrl: getVectorTileLayerUrl,
            input_type: 'checkbox',
            input_group: 'bathymetry',
        }
    ]
}

export default config;

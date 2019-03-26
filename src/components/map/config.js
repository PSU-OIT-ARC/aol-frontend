import { createStyle } from 'vuelayers/lib/ol-ext';


// need to handshake instaed
const token = `vOu43bHX8xtRlR84akQGzfjQSfgDw-Qc4KLPbgxLkwqqAawM7S\
p5Z0LzNnLmAgXPhS8jwZ4UpOlZElJNBRyeroumakaval58kJ63Igw-0yDsOcZhkFA\
OVeWWulPqTSWWX6AEItVxzdcgnb6uliYfE28xvflwybAouf-8V7mXZOpOcL77K-6E\
4J9BkYSQ6-O7KWJ6Fd07RvPP48IPOOE6m_kZbFY00VWVj6zspvcZMsuSktp0XZ3Is\
jPn1qChZa2fxdsiuOlVi_3iy8QgT5dICFdAQ_m8-qoTHY_rVX6ICFQ`;

const ArcGisOnlineServicesBaseUrl = "https://services.arcgisonline.com";
const ArcGisOnlineTilesBaseUrl = "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY";
const rest_path = "arcgis/rest/services";

const ArcGisOnlineServicesUrl = `${ArcGisOnlineServicesBaseUrl}/${rest_path}`;
const ArcGisOnlineTilesUrl = `${ArcGisOnlineTilesBaseUrl}/${rest_path}`;

const config = {
    token: token,
    map_center: [-121.511856, 44.002925],
    bounds_padding: 120,
    zoom: 7.45,
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
        url: `${ArcGisOnlineTilesUrl}/NLCD/MapServer/tile/{z}/{y}/{x}?token=${token}`,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997],
      }
    ],
    featureLayers: [
      {
        id: 'publand',
        visible: false,
        url: `${ArcGisOnlineTilesUrl}/Vector_Publands/VectorTileServer/tile/{z}/{y}/{x}.pbf?token=${token}`,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997]
      },
      {
        id: 'nopubland',
        visible: true,
        url: `${ArcGisOnlineTilesUrl}/Vector_NoPub/VectorTileServer/tile/{z}/{y}/{x}.pbf?token=${token}`,
        extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997]
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

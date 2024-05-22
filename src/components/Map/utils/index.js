import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export function updateFeature(map, draw, selectedFeatureId) {
  if (selectedFeatureId) {
    const feature = draw.get(selectedFeatureId);
    const polygonSize = 200; // meters
    // Create a buffer around the polygon
    const buffer = turf.buffer(feature, polygonSize, {
      units: 'meters',
    });
    console.log('Buffer', buffer);
    const difference = turf.difference(buffer, feature);
    // Add or update the buffer layer on the map
    if (map.getSource('buffer')) {
      map.getSource('buffer').setData(difference);
    } else {
      map.addSource('buffer', {
        type: 'geojson',
        data: difference,
      });

      map.addLayer({
        id: 'buffer',
        type: 'fill',
        source: 'buffer',
        layout: {},
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.3,
        },
      });
      map.addLayer({
        id: 'buffer-outline',
        type: 'line',
        source: 'buffer',
        layout: {},
        paint: {
          'line-color': '#f00',
          'line-width': 3,
          'line-opacity': 0.7,
        },
      });
    }
  }
}

export const drawStyles = [
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    paint: {
      'fill-color': '#6e599f',
      'fill-opacity': 0.4,
    },
  },
  {
    id: 'gl-draw-polygon-stroke',
    type: 'line',
    paint: {
      'line-color': '#6e599f',
      'line-width': 4,
    },
  },
  {
    id: 'gl-draw-point',
    type: 'circle',
    paint: {
      'circle-radius': 10, // Point radius (width)
      'circle-color': '#fff', // Point color
    },
  },
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    paint: {
      'circle-radius': 10, // Active point radius (width)
      'circle-color': '#ccc', // Active point color
    },
  },
];

export function configureInfo(map) {
  return {
    latitude: map.getCenter().lng.toFixed(4),
    longitude: map.getCenter().lat.toFixed(4),
    zoom: map.getZoom().toFixed(2),
  };
}

export function initializeMap(ref, currentInfo, zoom) {
  return {
    container: ref.current,
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [currentInfo.longitude, currentInfo.latitude],
    zoom,
  };
}

export const drawSettings = {
  displayControlsDefault: true,
  controls: {
    polygon: true,
    trash: true,
  },
  styles: drawStyles,
};

export function initializeControlTools(map) {
  const nav = new mapboxgl.NavigationControl();
  const draw = new MapboxDraw(drawSettings);
  map.addControl(nav, 'top-right');
  map.addControl(draw, 'top-left');

  return { nav, draw };
}

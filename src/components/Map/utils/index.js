import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export function updateDraw(e, draw, map) {
  const coords = draw?.getAll()?.features?.[0]?.geometry?.coordinates?.[0];
  const mainPolygon = turf.polygon([coords]);
  const gapSize = 8;
  const borderSize = 200;

  const outerBuffer = turf.buffer(mainPolygon, gapSize + borderSize, {
    units: 'meters',
  });
  const innerBuffer = turf.buffer(mainPolygon, gapSize, { units: 'meters' });
  const borderPolygon = turf.difference(outerBuffer, innerBuffer);

  // Add the main polygon to the map

  // Add the border polygon to the map
  if (map.getSource('borderPolygon')) {
    const allLayers = map.getStyle().layers;
    allLayers.forEach((layer) => {
      if (layer.source === 'borderPolygon') {
        map.removeLayer(layer.id);
      }
    });
    map.removeSource('borderPolygon');
  }

  map.addSource('borderPolygon', {
    type: 'geojson',
    data: borderPolygon,
  });

  map.addLayer({
    id: 'borderPolygonLayer',
    type: 'fill',
    source: 'borderPolygon',
    layout: {},
    paint: {
      'fill-color': '#f00',
      'fill-opacity': 0.18,
    },
  });
  map.addLayer({
    id: 'borderPolygonLayerOutlineBorder',
    type: 'line',
    source: 'borderPolygon',
    layout: {},
    paint: {
      'line-color': '#f00',
      'line-opacity': 0.8,
      'line-width': 3.5,
    },
  });
}

export const drawStyles = [
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    paint: {
      'fill-color': '#6e599f',
      'fill-opacity': 0.3,
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
      'circle-radius': 7, // Point radius (width)
      'circle-color': '#aaa', // Point color
    },
  },
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    paint: {
      'circle-radius': 8, // Active point radius (width)
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

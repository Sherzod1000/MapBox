import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

export function mapSettings(currentInfo, zoom, containerRef, setCurrentInfo, outlineBorderCoordinates, setOutlineBorderCoordinates) {
  const map = new mapboxgl.Map({
    container: containerRef.current,
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [currentInfo.longitude, currentInfo.latitude],
    zoom,
  });

  function updateDraw(e) {
    const offsetValue = 0.1;
    const coords = draw.getAll()?.features?.[0].geometry?.coordinates?.[0];
    const offsettedCoords = coords.map(([lng, lat]) => ([lng + offsetValue, lat + offsetValue]))
    setOutlineBorderCoordinates(() => offsettedCoords);
  }

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-right");
  const draw = new MapboxDraw({
    displayControlsDefault: true,
    controls: {
      polygon: true,
      trash: true,
    },
    styles: [
      {
        'id': 'gl-draw-polygon-fill',
        'type': 'fill',
        'paint': {
          'fill-color': '#6e599f',
          'fill-opacity': 0.4
        }
      },
      {
        'id': 'gl-draw-polygon-stroke',
        'type': 'line',
        'paint': {
          'line-color': '#6e599f',
          'line-width': 2
        },
      },
      {
        'id': 'gl-draw-point',
        'type': 'circle',
        'paint': {
          'circle-radius': 8, // Point radius (width)
          'circle-color': '#aaa' // Point color
        }
      },
      {
        'id': 'gl-draw-point-active',
        'type': 'circle',
        'paint': {
          'circle-radius': 8, // Active point radius (width)
          'circle-color': '#ccc' // Active point color
        }
      }
    ]
  });
  map.addControl(draw, "top-left");
  console.log("Draw", draw?.getAll());

  map.on("move", () => {
    setCurrentInfo((prev) => ({
      ...prev,
      latitude: map.getCenter().lng.toFixed(4),
      longitude: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2),
    }));
  });

  map.on("draw.create", updateDraw);
  map.on("draw.delete", updateDraw);
  map.on("draw.update", updateDraw);
  return {map};
}

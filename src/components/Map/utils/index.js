import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
export function mapSettings(location, zoom, containerRef, setCurrentInfo) {
  const map = new mapboxgl.Map({
    container: containerRef.current,
    style: "mapbox://styles/mapbox/satellite-streets-v11",
    center: [location.longitude, location.latitude],
    zoom,
  });

  map.on("load", () => {
    map.addLayer({
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",

        // Use an 'interpolate' expression to add a smooth transition effect to the buildings' heights
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    });
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-right");
  const draw = new MapboxDraw();
  map.addControl(draw, "top-left");

  map.on("move", () => {
    setCurrentInfo((prev) => ({
      ...prev,
      latitude: map.getCenter().lng.toFixed(4),
      longitude: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2),
    }));
  });
  return { map };
}

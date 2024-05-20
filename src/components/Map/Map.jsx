import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { ToolContext } from "../../context/ToolContext";
import { mapSettings } from "./utils";
import {useGeoLocation} from "./hooks/useGeoLocation.jsx";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
export function Map() {
  const mapContainerRef = useRef();
  const { currentInfo, setCurrentInfo } = useContext(ToolContext);
  const {
    helperTools: { zoom },
  } = useContext(ToolContext);
  const {info} = useGeoLocation();
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [currentInfo.longitude, currentInfo.latitude],
      zoom,
    });


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
                'fill-opacity': 0.2
              }
            },
            {
              'id': 'gl-draw-polygon-stroke',
              'type': 'line',
              'paint': {
                'line-color': '#6e599f',
                'line-width': 3
              },
            },
            {
              'id': 'gl-draw-point',
              'type': 'circle',
              'paint': {
                'circle-radius': 10, // Point radius (width)
                'circle-color': '#aaa' // Point color
              }
            },
            {
              'id': 'gl-draw-point-active',
              'type': 'circle',
              'paint': {
                'circle-radius': 10, // Active point radius (width)
                'circle-color': '#ccc' // Active point color
              }
            }
          ]
        });
    map.addControl(draw, "top-left");

    map.on("move", () => {
      setCurrentInfo((prev) => ({
        ...prev,
        latitude: map.getCenter().lng.toFixed(4),
        longitude: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      }));
    });
    return () => {
      map.remove();
    };
  }, [zoom, location]);
  return (
    <div
      className={
        "w-screen h-screen overflow-hidden"
      }
      ref={mapContainerRef}
    ></div>
  );
}

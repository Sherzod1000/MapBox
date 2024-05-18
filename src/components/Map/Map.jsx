import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

export function Map() {
    const mapContainerRef = useRef();
    useEffect(() => {
       mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
       const map = new mapboxgl.Map({
         container: mapContainerRef.current,
         style: 'mapbox://styles/mapbox/satellite-streets-v11',
         center: [69.2401, 41.2995],
         zoom: 12,
         pitch: 45,
         bearing: -5.6,
       })
  
      map.on('load', () => {
        map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
  
            // Use an 'interpolate' expression to add a smooth transition effect to the buildings' heights
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        })
      })
  
      return () => {
         map.remove();
      }
    }, []);
   return (
    <div className={"w-screen h-screen flex flex-col items-center justify-center overflow-hidden"} ref={mapContainerRef}></div>
   )
}
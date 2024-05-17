import './App.css'
import {useEffect, useRef} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
function App() {
  const mapContainerRef = useRef();
  useEffect(() => {
     mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
     console.log(import.meta.env.VITE_MAPBOX_TOKEN)
     const map = new mapboxgl.Map({
       container: mapContainerRef.current,
       style: 'mapbox://styles/mapbox/streets-v11',
       center: [-74.5, 40],
       zoom: 9
     })

    map.on('load', () => {
      map.addSource('polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [-74.5, 40],
              [-74.0, 40.5],
              [-73.5, 40],
              [-74.5, 40],
            ],
          },
        },
      });

      map.addLayer({
        id: 'polygon',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': 'red',
          'fill-opacity': 1.5,
        },
      });

      map.addLayer({
        id: 'polygon-outline',
        type: 'line',
        source: 'polygon',
        layout: {},
        paint: {
          'line-color': 'red',
          'line-width': 2,
        },
      });
    });

    return () => {
       map.remove();
    }
  }, []);
  return (
    <>
      <div className={"w-screen h-screen flex flex-col items-center justify-center overflow-hidden"} ref={mapContainerRef}>
      </div>
    </>
  )
}

export default App

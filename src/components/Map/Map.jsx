import mapboxgl from "mapbox-gl";
import {useContext, useEffect, useRef, useState} from "react";
import {useGeoLocation} from "./hooks/useGeoLocation.jsx";
import {ToolContext} from "../../context/ToolContext.jsx";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from '@turf/turf';

export function Map() {
  const mapContainerRef = useRef();
  const {
    currentInfo,
    setCurrentInfo,
    helperTools: {zoom},
    outlineBorderCoordinates,
    setOutlineBorderCoordinates
  } = useContext(ToolContext);
  const [myMap, setMyMap] = useState(null);
  const {info} = useGeoLocation();
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [currentInfo.longitude, currentInfo.latitude],
      zoom,
    });

    setMyMap(() => map);


    function updateDraw(e) {
      console.log(draw.getSelected())
      const offsetValue = 0.1;
      const coords = draw.getAll()?.features?.[0].geometry?.coordinates?.[0];
      console.log(coords);
      const mainPolygon = turf.polygon([coords]);
      // Create a buffer around the polygon with a gap (e.g., 500 meters gap)
      const gapSize = 8; // in kilometers (500 meters)
      const borderSize = 200; // in kilometers (1000 meters)

      const outerBuffer = turf.buffer(mainPolygon, gapSize + borderSize, {units: 'meters'});
      const innerBuffer = turf.buffer(mainPolygon, gapSize, {units: 'meters'});
      const borderPolygon = turf.difference(outerBuffer, innerBuffer);

      // Add the main polygon to the map

      // Add the border polygon to the map
      if (map.getSource('borderPolygon')) {
        const allLayers = map.getStyle().layers;
        allLayers.forEach(layer => {
          if (layer.source === 'borderPolygon') {
            map.removeLayer(layer.id);
          }
        })
        map.removeSource('borderPolygon');
      }

      map.addSource('borderPolygon', {
        'type': 'geojson',
        'data': borderPolygon
      });

      map.addLayer({
        'id': 'borderPolygonLayer',
        'type': 'fill',
        'source': 'borderPolygon',
        'layout': {},
        'paint': {
          'fill-color': '#f00',
          'fill-opacity': 0.18,
        }
      });
      map.addLayer({
        'id': 'borderPolygonLayerOutlineBorder',
        'type': 'line',
        'source': 'borderPolygon',
        'layout': {},
        'paint': {
          'line-color': '#f00',
          'line-opacity': 0.8,
          'line-width': 3.5,
        }
      });
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
            'fill-opacity': 0.3
          }
        },
        {
          'id': 'gl-draw-polygon-stroke',
          'type': 'line',
          'paint': {
            'line-color': '#6e599f',
            'line-width': 4
          },
        },
        {
          'id': 'gl-draw-point',
          'type': 'circle',
          'paint': {
            'circle-radius': 7, // Point radius (width)
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
    map.on("draw.modechange", updateDraw);

    return () => map.remove();


  }, []);
  useEffect(() => {
    console.log("Border is changed !", myMap);
  }, [outlineBorderCoordinates]);
  return (
    <>
      <div
        className={
          "w-screen h-screen overflow-hidden"
        }
        ref={mapContainerRef}
      ></div>
      {/* {
        outlineBorderCoordinates?.length > 0 && (<Source
          id="border"
          type="geojson"
          data={{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [outlineBorderCoordinates],
            },
          }}
        >
          <Layer
            id="border-fill"
            type="fill"
            paint={{
              'fill-color': '#888888',
              'fill-opacity': 0.1,
            }}
          />
          <Layer
            id="border-outline"
            type="line"
            paint={{
              'line-color': '#000000',
              'line-width': 2,
            }}
          />
        </Source>)
      } */}
    </>
  );
}

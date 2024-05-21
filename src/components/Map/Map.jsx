import mapboxgl from 'mapbox-gl';
import { useContext, useEffect, useRef } from 'react';
import { useGeoLocation } from './hooks/useGeoLocation.jsx';
import { ToolContext } from '../../context/ToolContext.jsx';
import {
  configureInfo,
  initializeControlTools,
  initializeMap,
  updateDraw,
} from './utils/index.js';

export function Map() {
  const mapContainerRef = useRef();
  const {
    currentInfo,
    setCurrentInfo,
    helperTools: { zoom },
  } = useContext(ToolContext);
  const { info } = useGeoLocation();
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      ...initializeMap(mapContainerRef, currentInfo, zoom),
    });
    const { draw } = initializeControlTools(map);
    map.on('move', () => {
      setCurrentInfo((prev) => ({
        ...prev,
        ...configureInfo(map),
      }));
    });

    map.on('draw.create', (e) => updateDraw(e, draw, map));
    map.on('draw.delete', (e) => updateDraw(e, draw, map));
    map.on('draw.update', (e) => updateDraw(e, draw, map));
    map.on('draw.render', (e) => updateDraw(e, draw, map));
    return () => map.remove();
  }, []);
  return (
    <>
      <div
        className={'w-screen h-screen overflow-hidden'}
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

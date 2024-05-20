import mapboxgl from "mapbox-gl";
import {useContext, useEffect, useRef, useState} from "react";
import {Layer, Source} from 'react-map-gl';
import {ToolContext} from "../../context/ToolContext";
import {mapSettings} from "./utils";
import {useGeoLocation} from "./hooks/useGeoLocation.jsx";

export function Map() {
  const mapContainerRef = useRef();
  const {currentInfo, setCurrentInfo} = useContext(ToolContext);
  const [outlineBorderCoordinates, setOutlineBorderCoordinates] = useState([]);
  const {
    helperTools: {zoom},
  } = useContext(ToolContext);
  const {info} = useGeoLocation();
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const {map} = mapSettings(currentInfo, zoom, mapContainerRef, setCurrentInfo, outlineBorderCoordinates, setOutlineBorderCoordinates);
    return () => {
      map.remove();
    };
  }, [zoom, location]);
  console.log(outlineBorderCoordinates);
  return (
    <>
      <div
        className={
          "w-screen h-screen overflow-hidden"
        }
        ref={mapContainerRef}
      ></div>
      {
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
      }
    </>
  );
}

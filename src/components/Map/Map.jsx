import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { ToolContext } from "../../context/ToolContext";
import { mapSettings } from "./utils";

export function Map() {
  const mapContainerRef = useRef();
  const { setCurrentInfo } = useContext(ToolContext);
  const {
    helperTools: { zoom },
  } = useContext(ToolContext);
  const [location, setLocation] = useState({
    latitude: 69.2401,
    longitude: 41.2995,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLocation(() => ({ latitude, longitude }));
        setCurrentInfo((prev) => ({
          ...prev,
          latitude: latitude.toFixed(4),
          longitude: longitude.toFixed(4),
        }));
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true }
    );
  }, []);
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const { map } = mapSettings(
      location,
      zoom,
      mapContainerRef,
      setCurrentInfo
    );
    return () => {
      map.remove();
    };
  }, [zoom, location]);
  return (
    <div
      className={
        "w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      }
      ref={mapContainerRef}
    ></div>
  );
}

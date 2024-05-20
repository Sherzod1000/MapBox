import {useContext, useEffect, useState} from "react";
import {ToolContext} from "../../../context/ToolContext.jsx";

export function useGeoLocation() {
  const {setCurrentInfo} = useContext(ToolContext);
  const [info, setInfo] = useState({data: null, error: null});
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCurrentInfo((prev) => ({
          ...prev,
          latitude: latitude.toFixed(4),
          longitude: longitude.toFixed(4),
        }));
        setInfo(prev => ({
          ...prev,
          data: {latitude, longitude}
        }))
      },
      (error) => {
        console.log(error);
        setInfo(prev => ({
          ...prev,
          error
        }))
      },
      { enableHighAccuracy: true }
    );
  }, []);


  return info;
}
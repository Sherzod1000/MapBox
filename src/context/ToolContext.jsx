import {createContext, useState} from "react";

export const ToolContext = createContext();

export function ToolProvider({children}) {
  const [tools, setTools] = useState({
    select: false,
    point: false,
  });
  const [helperTools, setHelperTools] = useState({
    zoom: 15,
  });
  const [currentInfo, setCurrentInfo] = useState({
    longitude: 69.2401,
    latitude: 41.2995,
    zoom: 15,
  });
  const [outlineBorderCoordinates, setOutlineBorderCoordinates] = useState([]);
  return (
    <ToolContext.Provider
      value={{
        tools,
        setTools,
        helperTools,
        setHelperTools,
        currentInfo,
        setCurrentInfo,
        outlineBorderCoordinates,
        setOutlineBorderCoordinates
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

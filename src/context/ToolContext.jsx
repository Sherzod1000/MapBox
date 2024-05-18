import { createContext, useState } from "react";

export const ToolContext = createContext();

export function ToolProvider({ children }) {
  const [tools, setTools] = useState({
    select: false,
    point: false
  });
  return (
    <ToolContext.Provider
      value={{ tools, setTools }}
    >
      {children}
    </ToolContext.Provider>
  );
}

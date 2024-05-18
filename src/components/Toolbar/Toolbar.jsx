import { LuMousePointer } from "react-icons/lu";
import { MdOutlinePlace } from "react-icons/md";
import { Button } from "@nextui-org/button";
import { useContext } from "react";
import { ToolContext } from "../../context/ToolContext";
import { setReverseValue } from "./utils";
export function Toolbar() {
  const { tools, setTools } = useContext(ToolContext);
  return (
    <div className="flex flex-col items-center gap-2 fixed left-1 top-0 my-3 w-16 p-1 h-full shadow-sm rounded-md bg-[#ffffffe9]">
      <Button
        onClick={() => setReverseValue(setTools, "select")}
        size="lg"
        isIconOnly
        color="primary"
        variant={tools.select ? "solid" : "flat"}
      >
        <LuMousePointer />
      </Button>
      <Button
        onClick={() => setReverseValue(setTools, "point")}
        size="lg"
        isIconOnly
        color="primary"
        variant={tools.point ? "solid" : "flat"}
      >
        <MdOutlinePlace size={20} />
      </Button>
    </div>
  );
}

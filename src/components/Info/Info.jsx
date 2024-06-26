import { useContext } from 'react';
import { ToolContext } from '../../context/ToolContext';

export function Info() {
  const {
    currentInfo: { longitude, latitude, zoom },
  } = useContext(ToolContext);
  return (
    <div className="fixed left-[50%] translate-x-[-50%] top-2 max-w-fit w-full bg-[#fff] rounded-md p-4 shadow-md info">
      <ul className="flex flex-wrap items-center justify-center gap-4">
        <li className="flex items-center gap-1 sm:text-sm md:text-lg lg:text-xl font-mono font-bold">
          Longitude: <span className=" font-normal">{longitude}</span>
        </li>
        <li className="flex items-center gap-1 sm:text-sm md:text-lg lg:text-xl font-mono font-bold">
          Latitude: <span className=" font-normal">{latitude}</span>
        </li>
        <li className="flex items-center gap-1 sm:text-sm md:text-lg lg:text-xl font-mono font-bold">
          Zoom: <span className=" font-normal">{zoom}</span>
        </li>
      </ul>
    </div>
  );
}

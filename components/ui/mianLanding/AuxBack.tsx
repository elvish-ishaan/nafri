import { Smile } from "lucide-react";

export default function AuxBack() {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full  shadow-md border border-gray-200">
      <span className="text-black font-medium">NOT</span>
      <span className="text-gray-500">Backed by</span>
      <span className="bg-orange-500 text-white font-semibold px-2 rounded-md">Y</span>
      <span className="text-gray-500">Combinator</span>
      <Smile className="w-4 h-4 text-gray-500" />
    </div>
  );
}

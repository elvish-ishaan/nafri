import { Smile } from "lucide-react";

export default function AuxBack() {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full shadow-md border border-border">
      <span className="text-foreground font-medium">NOT</span>
      <span className="text-muted-foreground">Backed by</span>
      <span className="bg-orange-500 text-primary-foreground font-semibold px-2 rounded-md">Y</span>
      <span className="text-muted-foreground">Combinator</span>
      <Smile className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ds/button";

export function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-1">
        <h1>Dispatcher Hamburg</h1>
        <Button variant="ghost" size="icon">
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
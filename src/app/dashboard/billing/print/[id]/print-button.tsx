"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function PrintButton() {
  // Automatically open print dialog on load
  useEffect(() => {
    // Small delay to ensure styles are loaded
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Button onClick={() => window.print()} className="gap-2">
      <Printer className="w-4 h-4" />
      Print Invoice
    </Button>
  );
}

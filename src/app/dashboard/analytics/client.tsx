"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsClient() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[200px] w-full bg-slate-100 rounded-md flex items-center justify-center text-muted-foreground">
            Chart Visualization (Pending Recharts Installation)
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Dummy Sale</p>
                <p className="text-sm text-muted-foreground">customer@email.com</p>
              </div>
              <div className="ml-auto font-medium">+₹1,999.00</div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Another Sale</p>
                <p className="text-sm text-muted-foreground">another@email.com</p>
              </div>
              <div className="ml-auto font-medium">+₹39.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

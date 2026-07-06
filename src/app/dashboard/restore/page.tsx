"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RestorePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">System Restore</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Restore from Backup</CardTitle>
          <CardDescription>
            Restore the system from a previous JSON backup file. WARNING: This will overwrite current data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-md p-10 flex items-center justify-center text-muted-foreground">
            Drag and drop your backup JSON file here, or click to browse.
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" disabled>Restore Database</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

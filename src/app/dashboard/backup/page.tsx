"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BackupPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">System Backup</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Manual Backup</CardTitle>
          <CardDescription>
            Download a complete backup of the database as a JSON file, or trigger a cloud backup to Appwrite Storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Current Backup Destination: Appwrite Cloud Storage (Bucket ID: {process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "Not Configured"})
          </p>
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Button variant="default">Backup to Appwrite Cloud</Button>
          <Button variant="outline">Download JSON Backup</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

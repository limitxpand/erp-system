/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { restoreRecord } from "@/app/actions/recycle-bin";

export default function RecycleBinClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleRestore = async (item: any) => {
    setLoadingId(item.id);
    const result = await restoreRecord(item.id, item.originalTable, item.originalData);
    setLoadingId(null);
    if (result.success) {
      setData(data.filter(i => i.id !== item.id));
    } else {
      alert("Error restoring record: " + result.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deleted Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Deleted By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.originalTable}</TableCell>
                <TableCell>{new Date(item.deletedAt).toLocaleString()}</TableCell>
                <TableCell>{item.deletedByUser || "System"}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRestore(item)}
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? "Restoring..." : "Restore"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Recycle bin is empty.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createRole } from "@/app/actions/admin";

export default function RolesClient({ initialRoles }: { initialRoles: any[] }) {
  const [data, setData] = useState(initialRoles);
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    const result = await createRole(name, {}); // Permissions can be extended later
    setIsSubmitting(false);

    if (result.success) {
      setOpen(false);
      setData([{
        id: result.role?.id,
        name: result.role?.name,
      }, ...data]);
      setName("");
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Roles</CardTitle>
        <Button onClick={() => setOpen(true)}>Add Role</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create Role"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

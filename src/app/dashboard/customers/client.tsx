/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createCustomer, updateCustomer, deleteCustomer } from "../../actions/customers";

export default function CustomerClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers] = useState(initialCustomers.filter(c => c.status !== 'inactive'));
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ id: 0, name: "", contactNumber: "", city: "", address: "", gst: "", remarks: "", tags: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.contactNumber?.includes(search) || 
    c.tokenId?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNew = () => {
    setFormData({ id: 0, name: "", contactNumber: "", city: "", address: "", gst: "", remarks: "", tags: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: any) => {
    setFormData({
      id: customer.id,
      name: customer.name || "",
      contactNumber: customer.contactNumber || "",
      city: customer.city || "",
      address: customer.address || "",
      gst: customer.gst || "",
      remarks: customer.remarks || "",
      tags: customer.tags || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateCustomer(formData.id, formData);
    } else {
      await createCustomer(formData);
    }
    window.location.reload(); 
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
        <Button onClick={handleOpenNew}>+ Add New Customer</Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <Input placeholder="Contact Number *" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} required />
            <Input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            <Input placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <Input placeholder="GST Number" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
            <Input placeholder="Remarks" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
            <Button type="submit" className="w-full">{isEditing ? "Update" : "Save"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer List</CardTitle>
          <Input 
            placeholder="Search by name, phone or ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.tokenId}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.contactNumber}</TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(c)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No customers found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

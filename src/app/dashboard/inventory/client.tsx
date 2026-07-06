/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createInventoryItem, updateInventory, deleteInventory } from "../../actions/inventory";
import { AlertCircle } from "lucide-react";

export default function InventoryClient({ initialInventory }: { initialInventory: any[] }) {
  const [inventory] = useState(initialInventory.filter(i => i.status !== 'inactive'));
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ id: 0, itemName: "", category: "", sku: "", quantity: 0, minQuantity: 0, sellingPrice: "", costPrice: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInventory = inventory.filter(i => 
    i.itemName?.toLowerCase().includes(search.toLowerCase()) || 
    i.sku?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNew = () => {
    setFormData({ id: 0, itemName: "", category: "", sku: "", quantity: 0, minQuantity: 0, sellingPrice: "", costPrice: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormData({
      id: item.id,
      itemName: item.itemName || "",
      category: item.category || "",
      sku: item.sku || "",
      quantity: item.quantity || 0,
      minQuantity: item.minQuantity || 0,
      sellingPrice: item.sellingPrice || "",
      costPrice: item.costPrice || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateInventory(formData.id, formData);
    } else {
      await createInventoryItem(formData);
    }
    window.location.reload(); 
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteInventory(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <Button onClick={handleOpenNew}>+ Add New Item</Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Item Name *" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} required />
            <Input placeholder="SKU *" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
            <Input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input type="number" placeholder="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
              </div>
              <div>
                <label className="text-sm font-medium">Min Quantity Alert</label>
                <Input type="number" placeholder="0" value={formData.minQuantity} onChange={e => setFormData({...formData, minQuantity: parseInt(e.target.value)})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Selling Price (₹)</label>
                <Input type="number" step="0.01" placeholder="0.00" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Cost Price (₹)</label>
                <Input type="number" step="0.01" placeholder="0.00" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} />
              </div>
            </div>
            
            <Button type="submit" className="w-full">{isEditing ? "Update" : "Save"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventory List</CardTitle>
          <Input 
            placeholder="Search by name, SKU or category..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">
                    {i.itemName}
                    {i.quantity <= i.minQuantity && (
                      <span className="ml-2 inline-flex items-center text-xs text-red-500 font-medium">
                        <AlertCircle className="w-3 h-3 mr-1" /> Low Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{i.sku}</TableCell>
                  <TableCell>{i.category}</TableCell>
                  <TableCell>{parseFloat(i.sellingPrice || "0").toFixed(2)}</TableCell>
                  <TableCell className={i.quantity <= i.minQuantity ? "text-red-600 font-bold" : ""}>
                    {i.quantity}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(i)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(i.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No inventory items found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

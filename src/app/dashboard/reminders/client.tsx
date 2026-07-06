/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateReminderStatus, createReminder, deleteReminder } from "@/app/actions/reminders";

export default function RemindersClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "" });

  const markComplete = async (id: number) => {
    setLoadingId(id);
    const result = await updateReminderStatus(id, "completed");
    setLoadingId(null);
    if (result.success) {
      setData(data.map(r => r.id === id ? { ...r, status: "completed" } : r));
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this reminder?")) {
      const res = await deleteReminder(id);
      if (res.success) {
        window.location.reload();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    
    await createReminder({
      title: formData.title,
      description: formData.description,
      dueDate: new Date(formData.dueDate)
    });
    
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Reminders</CardTitle>
        <Button onClick={() => setIsModalOpen(true)}>Add Custom Reminder</Button>
      </CardHeader>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Title *" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
            <Input 
              placeholder="Description" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <Input 
              type="date"
              value={formData.dueDate} 
              onChange={e => setFormData({...formData, dueDate: e.target.value})} 
              required 
            />
            <Button type="submit" className="w-full">Save</Button>
          </form>
        </DialogContent>
      </Dialog>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(reminder => (
              <TableRow key={reminder.id}>
                <TableCell className="font-medium">{reminder.title}</TableCell>
                <TableCell>{reminder.description || "-"}</TableCell>
                <TableCell>{new Date(reminder.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reminder.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {reminder.status}
                  </span>
                </TableCell>
                <TableCell>{reminder.assignedToUser || "Any"}</TableCell>
                <TableCell className="space-x-2">
                  {reminder.status !== "completed" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => markComplete(reminder.id)}
                      disabled={loadingId === reminder.id}
                    >
                      {loadingId === reminder.id ? "Marking..." : "Mark Complete"}
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(reminder.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No reminders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

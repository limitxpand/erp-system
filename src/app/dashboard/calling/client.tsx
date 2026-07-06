/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateCallStatus } from "@/app/actions/calling";

export default function CallingClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  
  // Form states
  const [status, setStatus] = useState("");
  const [review, setReview] = useState("");
  const [remarks, setRemarks] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = (call: any) => {
    setSelectedCall(call);
    setStatus(call.callStatus || "Not Called");
    setReview(call.review || "");
    setRemarks(call.remarks || "");
    setNextDate(call.nextCallDate ? new Date(call.nextCallDate).toISOString().split('T')[0] : "");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!selectedCall) return;
    setIsSubmitting(true);
    
    const result = await updateCallStatus({
      callId: selectedCall.id,
      status,
      review,
      remarks,
      nextCallDate: nextDate ? new Date(nextDate) : null,
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      setOpen(false);
      // Optimistic update
      setData(data.map(c => c.id === selectedCall.id ? { ...c, callStatus: status, review, remarks, nextCallDate: nextDate ? new Date(nextDate) : c.nextCallDate } : c));
    } else {
      alert("Failed to update: " + result.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calling Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Next Call Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(call => (
              <TableRow key={call.id}>
                <TableCell className="font-medium">{call.customerName}</TableCell>
                <TableCell>{call.customerContact}</TableCell>
                <TableCell>{call.nextCallDate ? new Date(call.nextCallDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{call.callStatus}</TableCell>
                <TableCell>{call.review || "-"}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleOpen(call)}>Update Status</Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No calls in queue</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Call Status - {selectedCall?.customerName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Called">Not Called</SelectItem>
                  <SelectItem value="Attended">Attended</SelectItem>
                  <SelectItem value="No Answer">No Answer</SelectItem>
                  <SelectItem value="Number Busy">Number Busy</SelectItem>
                  <SelectItem value="Wrong Number">Wrong Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Customer Review</label>
              <Select value={review} onValueChange={(val) => setReview(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Review" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Satisfied">Satisfied</SelectItem>
                  <SelectItem value="Unsatisfied">Unsatisfied</SelectItem>
                  <SelectItem value="Follow-up Required">Follow-up Required</SelectItem>
                  <SelectItem value="No Comments">No Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Next Call Date (Optional)</label>
              <Input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Remarks</label>
              <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Any notes from the call..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

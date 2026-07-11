"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendWhatsAppMessage } from "@/app/actions/whatsapp";

export default function WhatsAppPage() {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null, text: string }>({ type: null, text: "" });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || !message) return;
    
    setLoading(true);
    setStatus({ type: null, text: "" });
    
    const res = await sendWhatsAppMessage(number, message);
    
    if (res.success) {
      setStatus({ type: "success", text: "Message sent successfully!" });
      setMessage("");
    } else {
      setStatus({ type: "error", text: res.error || "Failed to send message." });
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">WhatsApp Manual Sender</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Send Custom Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Phone Number (with country code)</label>
              <Input 
                placeholder="e.g., +919876543210" 
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Message</label>
              <Textarea 
                placeholder="Type your message here..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send via Baileys API"}
            </Button>
            
            {status.type && (
              <div className={`p-3 mt-4 rounded border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {status.text}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
        <strong>Note:</strong> Automated billing receipts are sent instantly when a bill is generated. Use this page only for manual custom messages or testing if the Render API is online.
      </div>
    </div>
  );
}

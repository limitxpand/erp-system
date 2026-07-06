import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatsAppPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">WhatsApp Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Link WhatsApp Device</CardTitle>
          <CardDescription>
            Scan the QR code below using your WhatsApp app to link this ERP system to your WhatsApp account.
            Go to Settings {'>'} Linked Devices {'>'} Link a Device.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6 bg-slate-50 rounded-md">
          <iframe 
            src="https://whatsapp-service-native.onrender.com/qr" 
            title="WhatsApp QR Code"
            className="w-[400px] h-[400px] border-none bg-transparent overflow-hidden"
            scrolling="no"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Service Status</CardTitle>
          <CardDescription>
            Check if the WhatsApp background service is running correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <iframe 
            src="https://whatsapp-service-native.onrender.com/" 
            title="WhatsApp Status"
            className="w-full h-12 border-none bg-transparent"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export async function sendWhatsAppMessage(number: string, message: string) {
  try {
    const response = await fetch("https://whatsapp-service-native.onrender.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ number, message })
    });
    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

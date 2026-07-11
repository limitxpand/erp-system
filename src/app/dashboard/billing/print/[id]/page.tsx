import { getBillDetails } from "@/app/actions/billing";
import { notFound } from "next/navigation";
import { Printer } from "lucide-react";
import PrintButton from "./print-button";

export default async function PrintBillPage({ params }: { params: { id: string } }) {
  const billId = parseInt(params.id);
  if (isNaN(billId)) return notFound();

  const bill = await getBillDetails(billId);
  if (!bill) return notFound();

  return (
    <div className="bg-white min-h-screen p-8 text-black font-sans">
      <div className="max-w-3xl mx-auto border border-gray-200 p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Print Action Header (Hidden when printing) */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b print:hidden">
          <h1 className="text-xl font-bold">Print Preview</h1>
          <PrintButton />
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">ANMOL FABRICS</h2>
            <p className="text-gray-500 mt-1">123 Textile Market, City Name</p>
            <p className="text-gray-500">Phone: +91 98765 43210</p>
            <p className="text-gray-500">GSTIN: 07AABCU9603R1ZX</p>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-semibold text-gray-700">INVOICE</h3>
            <p className="font-medium mt-2">Bill No: {bill.serialNumber}</p>
            <p>Date: {new Date(bill.billDate).toLocaleDateString()}</p>
            <p>Salesman: {bill.salesman?.username || "N/A"}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8 border-t border-b py-4">
          <h4 className="font-semibold text-gray-700 mb-2">Billed To:</h4>
          <p className="font-bold text-lg">{bill.customer?.name}</p>
          <p>Contact: {bill.customer?.contactNumber}</p>
          {bill.customer?.address && <p>Address: {bill.customer.address}, {bill.customer.city}</p>}
          {bill.customer?.gst && <p>GST: {bill.customer.gst}</p>}
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-100">
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Item Name (SKU)</th>
              <th className="py-2 px-4 border text-right">Price</th>
              <th className="py-2 px-4 border text-center">Qty</th>
              <th className="py-2 px-4 border text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => {
              const price = parseFloat(item.sellingPrice || "0");
              const total = price * item.quantity;
              return (
                <tr key={item.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{item.itemName} ({item.sku})</td>
                  <td className="py-2 px-4 border text-right">₹{price.toFixed(2)}</td>
                  <td className="py-2 px-4 border text-center">{item.quantity}</td>
                  <td className="py-2 px-4 border text-right">₹{total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 font-bold text-xl border-t-2 border-black">
              <span>Grand Total:</span>
              <span>₹{parseFloat(bill.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm print:mt-8">
          <p>Thank you for your business!</p>
          <p>Goods once sold will not be taken back.</p>
        </div>

      </div>
    </div>
  );
}

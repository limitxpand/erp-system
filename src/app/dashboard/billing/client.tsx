/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBill } from "@/app/actions/billing";

export default function BillingClient({ customers, inventory }: { customers: any[], inventory: any[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState<{item: any, qty: number, discount: number}[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);

  const addToCart = () => {
    const item = inventory.find(i => i.id.toString() === selectedItem);
    if (!item) return;
    setCart([...cart, { item, qty, discount }]);
    setSelectedItem("");
    setQty(1);
    setDiscount(0);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => {
      const price = parseFloat(cartItem.item.sellingPrice || "0");
      return total + ((price - cartItem.discount) * cartItem.qty);
    }, 0);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!selectedCustomer || cart.length === 0) {
      alert("Please select customer and items.");
      return;
    }
    
    setIsSubmitting(true);
    const itemsData = cart.map(c => ({
      inventoryId: c.item.id,
      quantity: c.qty,
      discount: c.discount
    }));
    
    const result = await createBill({
      customerId: parseInt(selectedCustomer),
      totalAmount: calculateTotal(),
      items: itemsData,
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      alert("Bill Created Successfully!");
      setCart([]);
      setSelectedCustomer("");
    } else {
      alert("Failed to create bill: " + result.error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Billing POS</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select value={selectedItem} onValueChange={(val) => setSelectedItem(val || "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an Item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.itemName} ({item.sku}) - Stock: {item.quantity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Qty" value={qty} onChange={e => setQty(parseInt(e.target.value))} className="w-24" />
                <Input type="number" placeholder="Discount/pc" value={discount} onChange={e => setDiscount(parseFloat(e.target.value))} className="w-32" />
                <Button onClick={addToCart}>Add</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((cartItem, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{cartItem.item.itemName}</TableCell>
                      <TableCell>{parseFloat(cartItem.item.sellingPrice || "0").toFixed(2)}</TableCell>
                      <TableCell>{cartItem.qty}</TableCell>
                      <TableCell>{cartItem.discount}</TableCell>
                      <TableCell>{((parseFloat(cartItem.item.sellingPrice || "0") - cartItem.discount) * cartItem.qty).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeFromCart(idx)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cart.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">Cart is empty</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer</label>
                <Select value={selectedCustomer} onValueChange={(val) => setSelectedCustomer(val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name} ({c.contactNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Complete Bill"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

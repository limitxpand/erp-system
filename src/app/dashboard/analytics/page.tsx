import { db } from "@/db";
import { bills, inventory, customers } from "@/db/schema";
import { count, sum } from "drizzle-orm";
import AnalyticsClient from "./client";

export default async function AnalyticsPage() {
  const [totalBills] = await db.select({ value: count() }).from(bills);
  const [totalSales] = await db.select({ value: sum(bills.totalAmount) }).from(bills);
  const [totalCustomers] = await db.select({ value: count() }).from(customers);
  const [totalItems] = await db.select({ value: count() }).from(inventory);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">₹{totalSales.value || 0}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Bills</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalBills.value || 0}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Customers</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalCustomers.value || 0}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Inventory Items</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalItems.value || 0}</div>
            <p className="text-xs text-muted-foreground">Unique SKUs</p>
          </div>
        </div>
      </div>

      <AnalyticsClient />
    </div>
  );
}

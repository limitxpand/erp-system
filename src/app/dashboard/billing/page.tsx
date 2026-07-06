import { getCustomers } from "../../actions/customers";
import { getInventory } from "../../actions/inventory";
import BillingClient from "./client";

export default async function BillingPage() {
  const customers = await getCustomers();
  const inventory = await getInventory();
  
  return (
    <BillingClient customers={customers} inventory={inventory} />
  );
}

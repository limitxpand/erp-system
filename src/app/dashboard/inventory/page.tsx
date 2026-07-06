import { getInventory } from "../../actions/inventory";
import InventoryClient from "./client";

export default async function InventoryPage() {
  const inventory = await getInventory();
  
  return (
    <InventoryClient initialInventory={inventory} />
  );
}

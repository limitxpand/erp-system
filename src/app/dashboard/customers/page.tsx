import { getCustomers } from "../../actions/customers";
import CustomerClient from "./client";

export default async function CustomerPage() {
  const customers = await getCustomers();
  
  return (
    <CustomerClient initialCustomers={customers} />
  );
}

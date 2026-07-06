import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory items..."
            className="w-full bg-background pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Min Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ITM-001</TableCell>
              <TableCell>Premium Cotton Fabric</TableCell>
              <TableCell>Fabrics</TableCell>
              <TableCell>150</TableCell>
              <TableCell>50</TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                  In Stock
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ITM-002</TableCell>
              <TableCell>Silk Thread Box</TableCell>
              <TableCell>Accessories</TableCell>
              <TableCell className="text-red-500 font-bold">12</TableCell>
              <TableCell>20</TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                  Low Stock
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

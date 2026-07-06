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

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, phone, or token..."
            className="w-full bg-background pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">CUS000001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>+91 9876543210</TableCell>
              <TableCell>Mumbai</TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                  Active
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">CUS000002</TableCell>
              <TableCell>Jane Smith</TableCell>
              <TableCell>+91 9123456780</TableCell>
              <TableCell>Delhi</TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                  Active
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

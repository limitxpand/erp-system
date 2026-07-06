import { pgTable, serial, text, timestamp, boolean, jsonb, integer, decimal } from "drizzle-orm/pg-core";

// Roles & Users
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g. "Admin", "Data Entry Manager"
  permissions: jsonb("permissions").notNull().default({}), // e.g. { "billing": { "view": true, "create": true } }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  roleId: integer("role_id").references(() => roles.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(), // e.g. CUS000001
  name: text("name").notNull(),
  city: text("city"),
  address: text("address"),
  contactNumber: text("contact_number").notNull().unique(),
  alternateNumber: text("alternate_number"),
  gst: text("gst"),
  remarks: text("remarks"),
  tags: text("tags"),
  status: text("status").default("active"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inventory
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category"),
  sku: text("sku").notNull().unique(),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(0),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull().default("0"),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull().default("0"),
  status: text("status").default("active"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bills
export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  serialNumber: text("serial_number").notNull().unique(),
  billDate: timestamp("bill_date").defaultNow().notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  salesmanId: integer("salesman_id").references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  remarks: text("remarks"),
  status: text("status").default("completed"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const billItems = pgTable("bill_items", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").references(() => bills.id).notNull(),
  inventoryId: integer("inventory_id").references(() => inventory.id).notNull(),
  quantity: integer("quantity").notNull(),
  discountPerPiece: decimal("discount_per_piece", { precision: 10, scale: 2 }).default("0"),
});

// Calling Management
export const calling = pgTable("calling", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  billId: integer("bill_id").references(() => bills.id), // Context of call
  nextCallDate: timestamp("next_call_date"),
  callStatus: text("call_status").default("Not Called"), // Not Called, Attended, No Answer, etc.
  review: text("review"), // Satisfied, Unsatisfied, Follow-up Required
  remarks: text("remarks"),
  handledBy: integer("handled_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reminders
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").default("pending"), // pending, completed
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Log
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  module: text("module").notNull(),
  recordId: integer("record_id"),
  action: text("action").notNull(), // create, edit, delete, restore
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Recycle Bin
export const recycleBin = pgTable("recycle_bin", {
  id: serial("id").primaryKey(),
  module: text("module").notNull(),
  originalId: integer("original_id").notNull(),
  data: jsonb("data").notNull(),
  deletedBy: integer("deleted_by").references(() => users.id),
  deletedAt: timestamp("deleted_at").defaultNow().notNull(),
});

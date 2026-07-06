import { Client, Databases, Account } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy-project-id');

export const databases = new Databases(client);
export const account = new Account(client);

// Default Collection IDs (To be populated with actual IDs in production)
export const COLLECTIONS = {
    USERS: process.env.NEXT_PUBLIC_COLLECTION_USERS || 'users-collection-id',
    ROLES: process.env.NEXT_PUBLIC_COLLECTION_ROLES || 'roles-collection-id',
    CUSTOMERS: process.env.NEXT_PUBLIC_COLLECTION_CUSTOMERS || 'customers-collection-id',
    INVENTORY: process.env.NEXT_PUBLIC_COLLECTION_INVENTORY || 'inventory-collection-id',
    BILLS: process.env.NEXT_PUBLIC_COLLECTION_BILLS || 'bills-collection-id',
    BILL_ITEMS: process.env.NEXT_PUBLIC_COLLECTION_BILL_ITEMS || 'bill-items-collection-id',
    CALLING: process.env.NEXT_PUBLIC_COLLECTION_CALLING || 'calling-collection-id',
    REMINDERS: process.env.NEXT_PUBLIC_COLLECTION_REMINDERS || 'reminders-collection-id',
    AUDIT_LOGS: process.env.NEXT_PUBLIC_COLLECTION_AUDIT_LOGS || 'audit-logs-collection-id',
    RECYCLE_BIN: process.env.NEXT_PUBLIC_COLLECTION_RECYCLE_BIN || 'recycle-bin-collection-id'
};

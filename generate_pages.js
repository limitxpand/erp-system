const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'Reports', path: 'dashboard/reports', title: 'Reports' },
  { name: 'Analytics', path: 'dashboard/analytics', title: 'Analytics' },
  { name: 'Users', path: 'dashboard/users', title: 'User Management' },
  { name: 'Roles', path: 'dashboard/roles', title: 'Role Management' },
  { name: 'RecycleBin', path: 'dashboard/recycle-bin', title: 'Recycle Bin' },
  { name: 'AuditLog', path: 'dashboard/audit-log', title: 'Audit Log' },
  { name: 'Reminders', path: 'dashboard/reminders', title: 'Reminder System' },
  { name: 'Backup', path: 'dashboard/backup', title: 'Backup' },
  { name: 'Restore', path: 'dashboard/restore', title: 'Restore' },
  { name: 'Settings', path: 'dashboard/settings', title: 'Settings' }
];

const template = (title) => `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">${title}</h2>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">${title} content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
`;

pages.forEach(page => {
  const dir = path.join(__dirname, 'src/app', page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page.title));
});

console.log('Pages generated successfully!');

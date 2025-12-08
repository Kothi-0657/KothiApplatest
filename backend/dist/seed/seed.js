"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed/seed.ts
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function seed() {
    try {
        console.log('Seeding DB...');
        // Create extensions & tables must already be run (schema.sql). We'll just insert roles/permissions/admin.
        // permissions
        const permissions = [
            ['view_payments', 'View payment records'],
            ['edit_payments', 'Edit payment records'],
            ['view_services', 'View services & categories'],
            ['edit_services', 'Create/Update/Delete services'],
            ['view_customers', 'View customer list'],
            ['edit_customers', 'Edit customer data'],
            ['view_vendors', 'View vendor list'],
            ['edit_vendors', 'Edit vendor data'],
            ['view_bookings', 'View bookings'],
            ['edit_bookings', 'Edit bookings / assign vendors']
        ];
        for (const [key, desc] of permissions) {
            await db_1.default.query('INSERT INTO permissions (key, description) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING', [key, desc]);
        }
        console.log('permissions done');
        // roles
        await db_1.default.query("INSERT INTO roles (name, description) VALUES ('superadmin','Full access') ON CONFLICT (name) DO NOTHING");
        await db_1.default.query("INSERT INTO roles (name, description) VALUES ('manager','Manager') ON CONFLICT (name) DO NOTHING");
        await db_1.default.query("INSERT INTO roles (name, description) VALUES ('viewer','Viewer') ON CONFLICT (name) DO NOTHING");
        console.log('roles done');
        // assign all permissions to superadmin
        const roleRow = await db_1.default.query("SELECT id FROM roles WHERE name='superadmin'");
        const roleId = roleRow.rows[0].id;
        const permRows = await db_1.default.query('SELECT id FROM permissions');
        for (const p of permRows.rows) {
            await db_1.default.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [roleId, p.id]);
        }
        console.log('role_permissions done');
        // create default admin
        const email = 'admin@kothiindia.com';
        const password = 'Admin@123';
        const hash = await bcrypt_1.default.hash(password, 10);
        await db_1.default.query(`INSERT INTO admins (email, password_hash, full_name, is_super, role_id)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`, [email, hash, 'Kothi Super Admin', true, roleId]);
        console.log('admin created ->', email, password);
        process.exit(0);
    }
    catch (err) {
        console.error('Seed error', err);
        process.exit(1);
    }
}
seed();

// src/seed/seed.ts
import pool from '../config/db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  try {
    console.log('Seeding DB...');
    // Create extensions & tables must already be run (schema.sql). We'll just insert roles/permissions/admin.

    // permissions
    const permissions = [
      ['view_payments','View payment records'],
      ['edit_payments','Edit payment records'],
      ['view_services','View services & categories'],
      ['edit_services','Create/Update/Delete services'],
      ['view_customers','View customer list'],
      ['edit_customers','Edit customer data'],
      ['view_vendors','View vendor list'],
      ['edit_vendors','Edit vendor data'],
      ['view_bookings','View bookings'],
      ['edit_bookings','Edit bookings / assign vendors']
    ];
    for (const [key, desc] of permissions) {
      await pool.query('INSERT INTO permissions (key, description) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING', [key, desc]);
    }
    console.log('permissions done');

    // roles
    await pool.query("INSERT INTO roles (name, description) VALUES ('superadmin','Full access') ON CONFLICT (name) DO NOTHING");
    await pool.query("INSERT INTO roles (name, description) VALUES ('manager','Manager') ON CONFLICT (name) DO NOTHING");
    await pool.query("INSERT INTO roles (name, description) VALUES ('viewer','Viewer') ON CONFLICT (name) DO NOTHING");
    console.log('roles done');

    // assign all permissions to superadmin
    const roleRow = await pool.query("SELECT id FROM roles WHERE name='superadmin'");
    const roleId = roleRow.rows[0].id;
    const permRows = await pool.query('SELECT id FROM permissions');
    for (const p of permRows.rows) {
      await pool.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [roleId, p.id]);
    }
    console.log('role_permissions done');

    // create default admin
    const email = 'admin@kothiindia.com';
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admins (email, password_hash, full_name, is_super, role_id)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email, hash, 'Kothi Super Admin', true, roleId]
    );
    console.log('admin created ->', email, password);

    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();

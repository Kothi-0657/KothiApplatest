import { Request, Response } from 'express';
import pool from '../config/db';

export const listServices = async (_req: Request, res: Response) => {
try {
const result = await pool.query('SELECT * FROM services ORDER BY id');
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to fetch services' });
}
};

export const getService = async (req: Request, res: Response) => {
try {
const { id } = req.params;
const result = await pool.query('SELECT * FROM services WHERE id=$1', [id]);
if (!result.rows.length) return res.status(404).json({ error: 'Service not found' });
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to fetch service' });
}
};

export const createService = async (req: Request, res: Response) => {
try {
const { name, description, price } = req.body;
const result = await pool.query(
'INSERT INTO services (name, description, price) VALUES ($1,$2,$3) RETURNING *',
[name, description, price]
);
res.status(201).json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to create service' });
}
};

export const updateService = async (req: Request, res: Response) => {
try {
const { id } = req.params;
const { name, description, price } = req.body;
const result = await pool.query(
'UPDATE services SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *',
[name, description, price, id]
);
if (!result.rows.length) return res.status(404).json({ error: 'Service not found' });
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to update service' });
}
};

export const deleteService = async (req: Request, res: Response) => {
try {
const { id } = req.params;
await pool.query('DELETE FROM services WHERE id=$1', [id]);
res.json({ message: 'Service deleted' });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to delete service' });
}
};
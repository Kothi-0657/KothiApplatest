import { Request, Response } from 'express';
}
};

// List bookings for user or admin
export const listBookings = async (req: any, res: Response) => {
try {
const user = req.user; // if admin, allow all
if (user?.role === 'admin') {
const result = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
return res.json(result.rows);
}

const result = await pool.query('SELECT * FROM bookings WHERE user_id=$1 ORDER BY id DESC', [user.id]);
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to list bookings' });
}
};

export const getBooking = async (req: any, res: Response) => {
try {
const { id } = req.params;
const result = await pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
if (!result.rows.length) return res.status(404).json({ error: 'Booking not found' });
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to fetch booking' });
}
};

// Assign vendor (admin)
export const assignVendor = async (req: any, res: Response) => {
try {
const { id } = req.params; // booking id
const { vendor_id } = req.body;
if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

const result = await pool.query('UPDATE bookings SET vendor_id=$1, status=$2 WHERE id=$3 RETURNING *', [vendor_id, 'assigned', id]);
if (!result.rows.length) return res.status(404).json({ error: 'Booking not found' });

res.json({ message: 'Vendor assigned', booking: result.rows[0] });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to assign vendor' });
}
};

// Update booking status (vendor/admin)
export const updateBookingStatus = async (req: any, res: Response) => {
try {
const { id } = req.params;
const { status } = req.body;
const allowed = ['requested', 'assigned', 'started', 'in_progress', 'completed', 'cancelled'];
if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

const result = await pool.query('UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
if (!result.rows.length) return res.status(404).json({ error: 'Booking not found' });

res.json({ message: 'Status updated', booking: result.rows[0] });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to update status' });
}
};
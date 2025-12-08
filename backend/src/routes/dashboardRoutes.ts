// backend/src/routes/dashboardRoutes.ts
import express from "express";
import pool from "../config/db";

const router = express.Router();

/**
 * GET /api/dashboard/extended
 * Query params:
 *   from (YYYY-MM-DD), to (YYYY-MM-DD), city, category
 *
 * Response includes:
 *  - totalCustomers, totalBookings, totalRevenue
 *  - graphData (daily revenue)
 *  - monthlyServiceSales (category x month)
 *  - cityDistribution
 *  - customersList (basic + status)
 *  - vendorsList (vendor + allocated services count)
 *  - paymentsList (recent payments)
 */
router.get("/extended", async (req, res) => {
  const { from, to, city, category } = req.query;

  // Helper to push params
  const params: any[] = [];
  const dateFilterSqlParts: string[] = [];

  if (from && to) {
    // we'll filter by payments.created_at for revenue & payments sections
    params.push(from);
    params.push(to);
    dateFilterSqlParts.push(`p.created_at BETWEEN $${params.length - 1}::timestamptz AND $${params.length}::timestamptz`);
  }

  // Build base date filter string (if any)
  const dateFilter = dateFilterSqlParts.length ? `AND ${dateFilterSqlParts.join(" AND ")}` : "";

  try {
    // 1) Totals
    const customersQ = `SELECT COUNT(*) AS total FROM customers;`;
    const bookingsQ = `SELECT COUNT(*) AS total FROM bookings;`;
    const revenueQ = `
      SELECT COALESCE(SUM(p.amount),0)::numeric(14,2) AS total
      FROM payments p
      WHERE p.status = 'completed' ${dateFilter};
    `;

    const [customersRes, bookingsRes, revenueRes] = await Promise.all([
      pool.query(customersQ),
      pool.query(bookingsQ),
      pool.query(revenueQ, params),
    ]);

    // 2) Revenue trend by day
    const graphQ = `
      SELECT
        TO_CHAR(p.created_at, 'YYYY-MM-DD') AS day,
        COALESCE(SUM(p.amount),0) AS revenue
      FROM payments p
      WHERE p.status = 'completed' ${dateFilter}
      GROUP BY day
      ORDER BY day ASC;
    `;
    const graphRes = await pool.query(graphQ, params);

    // 3) Monthly service-type sales (bar chart): group by category and month
    // Join payments -> bookings -> services
    // note: payments.related_booking -> bookings.id, bookings.service_id -> services.id
    let monthlyParams = [...params];
    let monthlyDateFilter = "";
    if (from && to) {
      monthlyDateFilter = `AND p.created_at BETWEEN $${monthlyParams.length + 1}::timestamptz AND $${monthlyParams.length + 2}::timestamptz`;
      monthlyParams.push(from, to);
    }
    const monthlyQ = `
      SELECT
        s.category,
        TO_CHAR(p.created_at, 'YYYY-MM') AS month,
        SUM(p.amount)::numeric(14,2) AS revenue,
        COUNT(*) AS payments_count
      FROM payments p
      LEFT JOIN bookings b ON b.id = p.related_booking
      LEFT JOIN services s ON s.id = b.service_id
      WHERE p.status = 'completed' ${monthlyDateFilter}
      ${category ? " AND s.category = $"+(monthlyParams.length+1) : ""}
      GROUP BY s.category, month
      ORDER BY month ASC, s.category;
    `;
    if (category) monthlyParams.push(category);
    const monthlyRes = await pool.query(monthlyQ, monthlyParams);

    // Transform monthlyRes into structure convenient for chart: categories array and months x revenues map
    const monthlyRows = monthlyRes.rows;
    const monthsSet = new Set<string>();
    const categoriesSet = new Set<string>();
    monthlyRows.forEach((r: any) => {
      monthsSet.add(r.month);
      categoriesSet.add(r.category || "Uncategorized");
    });
    const months = Array.from(monthsSet).sort();
    const categories = Array.from(categoriesSet);

    // create series: [{ category, data: [v for each month] }]
    const monthlySeries = categories.map((cat) => {
      const data = months.map((m) => {
        const found = monthlyRows.find((r: any) => (r.category || "Uncategorized") === cat && r.month === m);
        return found ? Number(found.revenue) : 0;
      });
      return { category: cat, data };
    });

    // 4) City distribution (bookings count + revenue)
    // ---------------------------
// 4) City distribution
// city is inside customers.address JSON → address->>'city'
// ---------------------------
const cityQ = `
  SELECT
    COALESCE(c.address->>'city','Unknown') AS city,
    COUNT(b.id) AS bookings,
    COALESCE(SUM(p.amount),0)::numeric(14,2) AS revenue
  FROM customers c
  LEFT JOIN bookings b ON b.customer_id = c.id
  LEFT JOIN payments p ON p.related_booking = b.id AND p.status = 'completed'
  ${city ? "WHERE c.address->>'city' = $1" : ""}
  GROUP BY COALESCE(c.address->>'city','Unknown')
  ORDER BY bookings DESC
  LIMIT 20;
`;

const cityRes = city
  ? await pool.query(cityQ, [city])
  : await pool.query(cityQ);

// ---------------------------
// 5) Customers list with booking status summary
// ---------------------------
const customersListQ = `
  SELECT
    c.id,
    c.name,
    c.email,
    c.phone,
    c.address->>'city' AS city,
    COUNT(b.id) FILTER (WHERE b.status = 'requested') AS requested,
    COUNT(b.id) FILTER (WHERE b.status = 'accepted') AS accepted,
    COUNT(b.id) FILTER (WHERE b.status = 'completed') AS completed,
    COUNT(b.id) AS total_bookings,
    MAX(b.booked_at) AS last_booked_at
  FROM customers c
  LEFT JOIN bookings b ON b.customer_id = c.id
  GROUP BY c.id
  ORDER BY total_bookings DESC
  LIMIT 200;
`;

const customersListRes = await pool.query(customersListQ);

// ---------------------------
// 6) Vendors & allocated services
// ---------------------------
const vendorsQ = `
  SELECT
    v.id,
    COALESCE(v.company_name, v.contact_name) AS name,
    v.phone,
    v.email,
    v.total_jobs,
    COALESCE(array_length(v.services_offered,1),0) AS services_offered_count,
    COUNT(b.id) FILTER (WHERE b.vendor_id = v.id) AS bookings_assigned
  FROM vendors v
  LEFT JOIN bookings b ON b.vendor_id = v.id
  GROUP BY v.id
  ORDER BY bookings_assigned DESC;
`;

const vendorsRes = await pool.query(vendorsQ);


    // 7) Payments list (recent 100)
    const paymentsQ = `
      SELECT
        p.id, p.payment_ref, p.amount::numeric(14,2) AS amount, p.currency, p.status, p.method, p.transaction_id, p.related_booking,
        p.payer_id, p.payee_id, p.created_at,
        b.booking_ref, b.booked_at, s.name as service_name
      FROM payments p
      LEFT JOIN bookings b ON b.id = p.related_booking
      LEFT JOIN services s ON s.id = b.service_id
      ORDER BY p.created_at DESC
      LIMIT 200;
    `;
    const paymentsRes = await pool.query(paymentsQ);

    // response
    return res.json({
      totalCustomers: Number(customersRes.rows[0].total),
      totalBookings: Number(bookingsRes.rows[0].total),
      totalRevenue: Number(revenueRes.rows[0].total),
      graphData: graphRes.rows, // [{day, revenue}]
      monthly: {
        months,
        series: monthlySeries, // [{category, data: [numbers]}]
      },
      cityDistribution: cityRes.rows,
      customersList: customersListRes.rows,
      vendorsList: vendorsRes.rows,
      paymentsList: paymentsRes.rows,
    });
  } catch (err: any) {
    console.error("🔥 Dashboard Error:", err);
    return res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
      error: err.message,
    });
  }
});

export default router;

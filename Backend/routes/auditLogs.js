const express = require('express');
const auditLog = express.Router();
const db = require('../database/connection');

// Create audit log entry
auditLog.post("/createLog", async (req, res) => {
    const { user_id, description } = req.body;

    // Validate required fields
    if (!user_id || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        INSERT INTO audit_logs 
        (user_id, description) 
        VALUES ('${user_id}', '${description}')
    `;

    try {
        const result = await db(query, [user_id, description]);
        res.json({
            success: true,
            log_id: result.insertId,
            message: "Audit log created successfully"
        });
    } catch (err) {
        console.error("Error creating audit log:", err);
        res.status(500).json({ error: "Failed to create audit log" });
    }
});

// Get audit logs with filters
auditLog.get("/getLogs", async (req, res) => {
    const { user_id, entity_type, action_type, start_date, end_date } = req.query;
    
    let query = `
        SELECT al.*, u.username 
        FROM audit_logs al
        JOIN users u ON al.user_id = u.user_id
        WHERE 1=1
    `;
    const params = [];

    if (user_id) {
        query += ` AND al.user_id = ?`;
        params.push(user_id);
    }
    if (entity_type) {
        query += ` AND al.description LIKE ?`;
        params.push(`%${entity_type}%`);
    }
    if (action_type) {
        query += ` AND al.description LIKE ?`;
        params.push(`%${action_type}%`);
    }
    if (start_date) {
        query += ` AND al.timestamp >= ?`;
        params.push(start_date);
    }
    if (end_date) {
        query += ` AND al.timestamp <= ?`;
        params.push(end_date);
    }

    query += ` ORDER BY al.timestamp DESC`;

    try {
        const result = await db(query, params);
        res.json(result);
    } catch (err) {
        console.error("Error fetching audit logs:", err);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

auditLog.get("/getAllLogs", async (req, res) => {
    
    let query = `
        SELECT al.*, u.username 
        FROM audit_logs al
        JOIN users u ON al.user_id = u.user_id
        order by al.timestamp desc
    `;

    try {
        const result = await db(query);
        res.json(result);
    } catch (err) {
        console.error("Error fetching audit logs:", err);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});
module.exports = auditLog;
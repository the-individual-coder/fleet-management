const express = require('express')
const MaintenanceRequest = express.Router()
const db = require('../database/connection')

// Get all maintenance_requests
MaintenanceRequest.get("/getMaintenanceRequest", async (req, res) => {
    const query = "SELECT * FROM maintenance_requests";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new maintenance request
MaintenanceRequest.post("/registerMaintenanceRequest", async (req, res) => {
    const { name, priority, value, status, issue } = req.body;
    const query = `INSERT INTO maintenance_requests (name, priority, value, status, issue) VALUES ('${name}', '${priority}', ${value}, '${status}', '${issue}')`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing maintenance request
MaintenanceRequest.post("/updateMaintenanceRequest", async (req, res) => {
    const { id, name, priority, value, status, issue } = req.body;
    console.log("body :>>", req.body)
    const query = `UPDATE maintenance_requests SET 
        name = '${name}', 
        priority = '${priority}', 
        value = ${value}, 
        status = '${status}',
        issue = '${issue}'
        WHERE id = ${id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a maintenance request
MaintenanceRequest.delete("/removeMaintenanceRequest/:id", async (req, res) => {
    const query = `DELETE FROM maintenance_requests WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

module.exports = MaintenanceRequest
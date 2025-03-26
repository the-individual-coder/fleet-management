const express = require('express')
const ProcurementRequest = express.Router()
const db = require('../database/connection')
// Get all procurement_requests
ProcurementRequest.get("/getProcurementRequest", async (req, res) => {
    const query = "SELECT * FROM procurement_requests";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new asset
ProcurementRequest.post("/registerProcurementRequest", async (req, res) => {
    const { name, description, value, status } = req.body;
    const query = `INSERT INTO procurement_requests (name, description, value, status) VALUES ('${name}', '${description}', ${value}, '${status}')`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing asset
ProcurementRequest.post("/updateProcurementRequest", async (req, res) => {
    const { assetID, name, description, value, status } = req.body;
    console.log("body :>>", req.body)
    const query = `UPDATE procurement_requests SET name = '${name}', description = '${description}', value = ${value}, status = '${status}' WHERE id = ${assetID}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete an asset
ProcurementRequest.delete("/removeProcurementRequest/:id", async (req, res) => {
    const query = `DELETE FROM procurement_requests WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

module.exports = ProcurementRequest
const express = require('express')
const supplier = express.Router()
const db = require('../database/connection')

// Get all suppliers
supplier.get("/getSuppliers", async (req, res) => {
    const query = "SELECT * FROM suppliers";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new supplier
supplier.post("/registerSupplier", async (req, res) => {
    const { name, contactInfo, address } = req.body;
    const query = `INSERT INTO suppliers (name, contact_info, address) VALUES ('${name}', '${contactInfo}', '${address}')`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing supplier
supplier.post("/updateSupplier", async (req, res) => {
    const { supplierID, name, contactInfo, address } = req.body;
    const query = `UPDATE suppliers SET name = '${name}', contact_info = '${contactInfo}', address = '${address}' WHERE id = ${supplierID}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a supplier
supplier.delete("/removeSupplier/:id", async (req, res) => {
    const query = `DELETE FROM suppliers WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

module.exports = supplier 
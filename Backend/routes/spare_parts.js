const express = require('express')
const SpareParts = express.Router()
const db = require('../database/connection')

// Get all spare parts
SpareParts.get("/getSpareParts", async (req, res) => {
    const query = "SELECT * FROM spare_parts";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new spare part
SpareParts.post("/registerSparePart", async (req, res) => {
    const { name, description, value, status, lifespan, stock } = req.body;
    const query = `INSERT INTO spare_parts (name, description, value, status, lifespan, stock) 
                   VALUES ('${name}', '${description}', ${value}, '${status}', ${lifespan}, ${stock})`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing spare part
SpareParts.post("/updateSparePart", async (req, res) => {
    const { id, name, description, value, status, lifespan, stock } = req.body;
    console.log("body :>>", req.body)
    const query = `UPDATE spare_parts SET 
        name = '${name}', 
        description = '${description}', 
        value = ${value}, 
        status = '${status}',
        lifespan = ${lifespan},
        stock = ${stock}
        WHERE id = ${id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a spare part
SpareParts.delete("/removeSparePart/:id", async (req, res) => {
    const query = `DELETE FROM spare_parts WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});


SpareParts.get("/spare_parts/expiringSoon", async (req, res) => {
    // Get parts where remaining lifespan is <= threshold (e.g., 30 days)
    const threshold = req.query.threshold || 30; // default 30 days
    const query = `SELECT * FROM spare_parts 
                   WHERE lifespan IS NOT NULL 
                   AND lifespan <= ${threshold}
                   AND status = 'active'`;
    const result = await db(query);
    console.log()
    res.json(result);
});
module.exports = SpareParts
const express = require('express')
const asset = express.Router()
const db = require('../database/connection')

// Get all assets
asset.get("/getAssets", async (req, res) => {
    const query = "SELECT * FROM assets";
    const result = await db(query);
    res.json(result);
});

// Register a new asset
asset.post("/registerAsset", async (req, res) => {
    const { name, description, lifespan, value, status } = req.body;
    const query = `INSERT INTO assets (name, description, value, lifespan, status) VALUES ('${name}', '${description}', ${value}, '${lifespan}', '${status}')`;
    const result = await db(query);
    res.json(result);
});

// Update an existing asset
asset.post("/updateAsset", async (req, res) => {
    const { assetID, name, description, value, status, lifespan } = req.body;
    console.log("body :>>", req.body)
    const query = `UPDATE assets SET name = '${name}', description = '${description}', value = ${value}, lifespan = ${lifespan}, status = '${status}' WHERE id = ${assetID}`;
    const result = await db(query);
    res.json(result);
});

// Delete an asset
asset.delete("/removeAsset/:id", async (req, res) => {
    const query = `DELETE FROM assets WHERE id = ${req.params.id}`;
    const result = await db(query);
    res.json(result);
});
asset.get("/asset/expiringSoon", async (req, res) => {
    // Get parts where remaining lifespan is <= threshold (e.g., 30 days)
    const threshold = req.query.threshold || 30; // default 30 days
    const query = `SELECT * FROM assets 
                   WHERE lifespan IS NOT NULL 
                   AND lifespan <= ${threshold}
                   AND status = 'active'`;
    const result = await db(query);
    res.json(result);
});
module.exports = asset
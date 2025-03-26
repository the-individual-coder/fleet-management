const express = require('express')
const procurement = express.Router()
const db = require('../database/connection')
const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(d.getDate()).padStart(2, '0');         // Add leading zero
    return `${year}-${month}-${day}`;
};
// Get all procurement records
procurement.get("/getProcurements", async (req, res) => {
    const query = `SELECT procurement.*, suppliers.name as supplier_name, assets.name as asset_name FROM procurement 
    inner join suppliers on suppliers.id = procurement.supplier_id
    inner join assets on assets.id = procurement.asset_id`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new procurement
procurement.post("/registerProcurement", async (req, res) => {
    const { assetID, supplierID, procurementDate, quantity, totalCost, paymentMethod, status } = req.body;
    const query = `
        INSERT INTO procurement (asset_id, supplier_id, procurement_date, quantity, total_cost, payment_method, status) 
        VALUES (${assetID}, ${supplierID}, '${formatDateForInput(procurementDate)}', ${quantity}, ${totalCost}, '${paymentMethod}', '${status}')
    `;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing procurement
procurement.post("/updateProcurement", async (req, res) => {
    const { procurementID, assetID, supplierID, procurementDate, quantity, totalCost, paymentMethod, status } = req.body;
    const query = `
        UPDATE procurement 
        SET asset_id = ${assetID}, supplier_id = ${supplierID}, procurement_date = '${formatDateForInput(procurementDate)}', 
            quantity = ${quantity}, total_cost = ${totalCost}, payment_method = '${paymentMethod}', 
            status = '${status}' 
        WHERE id = ${procurementID}
    `;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a procurement
procurement.delete("/removeProcurement/:id", async (req, res) => {
    const query = `DELETE FROM procurement WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});
module.exports = procurement 
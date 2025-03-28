const express = require('express')
const vendorRequest = express.Router()
const db = require('../database/connection')
const formatDate = require('../utils/global')
// Get all vendor requests with vendor names
vendorRequest.get("/getVendorRequests", async (req, res) => {
    const query = `
        SELECT vr.*, v.name as vendor_name 
        FROM vendor_requests vr
        INNER JOIN vendors v ON vr.vendor_id = v.vendor_id
        ORDER BY vr.request_date DESC
    `;
    const result = await db(query);
    res.json(result);
});

// Get requests by status with vendor names
vendorRequest.get("/getVendorRequestsByStatus/:status", async (req, res) => {
    const { status } = req.params;
    const query = `
        SELECT vr.*, v.name as vendor_name 
        FROM vendor_requests vr
        INNER JOIN vendors v ON vr.vendor_id = v.vendor_id
        WHERE vr.status = '${status}'
        ORDER BY vr.request_date DESC
    `;
    const result = await db(query);
    res.json(result);
});

// Get requests by vendor ID with vendor name
vendorRequest.get("/getVendorRequestsByVendor/:vendor_id", async (req, res) => {
    const { vendor_id } = req.params;
    const query = `
        SELECT vr.*, v.name as vendor_name 
        FROM vendor_requests vr
        INNER JOIN vendors v ON vr.vendor_id = v.vendor_id
        WHERE vr.vendor_id = ${vendor_id}
        ORDER BY vr.request_date DESC
    `;
    const result = await db(query);
    res.json(result);
});

// Create new vendor request
vendorRequest.post("/createVendorRequest", async (req, res) => {
    const { vendor_id, requested_item, needed_by_date, notes } = req.body;
    const query = `
        INSERT INTO vendor_requests 
        (vendor_id, requested_item, needed_by_date, notes) 
        VALUES 
        (${vendor_id}, '${requested_item}', '${formatDate(needed_by_date)}', '${notes}')
    `;
    const result = await db(query);
    res.json(result);
});

// Update vendor request
vendorRequest.post("/updateVendorRequest", async (req, res) => {
    const { request_id, vendor_id, requested_item, needed_by_date, status, approved_by, fulfilled_date, notes } = req.body;
    
    let updateFields = [];
    if (vendor_id) updateFields.push(`vendor_id = ${vendor_id}`);
    if (requested_item) updateFields.push(`requested_item = '${requested_item}'`);
    if (needed_by_date) updateFields.push(`needed_by_date = '${formatDate(needed_by_date)}'`);
    if (status) updateFields.push(`status = '${status}'`);
    if (approved_by) updateFields.push(`approved_by = '${approved_by}'`);
    if (fulfilled_date) updateFields.push(`fulfilled_date = '${formatDate(fulfilled_date)}'`);
    if (notes !== undefined) updateFields.push(`notes = '${notes}'`);
    
    const query = `
        UPDATE vendor_requests 
        SET ${updateFields.join(', ')}
        WHERE request_id = ${request_id}
    `;
    
    const result = await db(query);
    res.json(result);
});

// Update request status
vendorRequest.post("/updateRequestStatus", async (req, res) => {
    const { request_id, status, approved_by } = req.body;
    const query = `
        UPDATE vendor_requests 
        SET status = '${status}'
        ${approved_by ? `, approved_by = '${approved_by}'` : ''}
        WHERE request_id = ${request_id}
    `;
    const result = await db(query);
    res.json(result);
});

// Mark request as fulfilled
vendorRequest.post("/markRequestFulfilled", async (req, res) => {
    const { request_id, fulfilled_date } = req.body;
    const query = `
        UPDATE vendor_requests 
        SET status = 'fulfilled', 
            fulfilled_date = '${fulfilled_date}'
        WHERE request_id = ${request_id}
    `;
    const result = await db(query);
    res.json(result);
});

// Delete vendor request
vendorRequest.delete("/deleteVendorRequest/:request_id", async (req, res) => {
    const { request_id } = req.params;
    const query = `DELETE FROM vendor_requests WHERE request_id = ${request_id}`;
    const result = await db(query);
    res.json(result);
});

module.exports = vendorRequest;
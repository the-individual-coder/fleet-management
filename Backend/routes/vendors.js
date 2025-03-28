const express = require('express')
const vendor = express.Router()
const db = require('../database/connection')

// Get all vendors
vendor.get("/getVendors", async (req, res) => {
    const query = "SELECT * FROM vendors";
    const result = await db(query);
    res.json(result);
});

// Get approved vendors
vendor.get("/getApprovedVendors", async (req, res) => {
    const query = "SELECT * FROM vendors WHERE is_approved = 1";
    const result = await db(query);
    res.json(result);
});

// Register a new vendor
vendor.post("/registerVendor", async (req, res) => {
    const { name, contact_person, email, phone, address, service_type } = req.body;
    const query = `
        INSERT INTO vendors 
        (name, contact_person, email, phone, address, service_type) 
        VALUES 
        ('${name}', '${contact_person}', '${email}', '${phone}', '${address}', '${service_type}')
    `;
    const result = await db(query);
    res.json(result);
});

// Update vendor information
vendor.post("/updateVendor", async (req, res) => {
    const { vendor_id, name, contact_person, email, phone, address, service_type, is_approved } = req.body;
    const query = `
        UPDATE vendors SET 
        name = '${name}', 
        contact_person = '${contact_person}', 
        email = '${email}', 
        phone = '${phone}', 
        address = '${address}', 
        service_type = '${service_type}',
        is_approved = ${is_approved}
        WHERE vendor_id = ${vendor_id}
    `;
    const result = await db(query);
    res.json(result);
});

// Approve/Disapprove vendor
vendor.post("/toggleVendorApproval", async (req, res) => {
    const { vendor_id, is_approved } = req.body;
    const query = `UPDATE vendors SET is_approved = ${is_approved} WHERE vendor_id = ${vendor_id}`;
    const result = await db(query);
    res.json(result);
});

// Delete a vendor
vendor.delete("/removeVendor/:id", async (req, res) => {
    const query = `DELETE FROM vendors WHERE vendor_id = ${req.params.id}`;
    const result = await db(query);
    res.json(result);
});

module.exports = vendor;
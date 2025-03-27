const express = require('express')
const vehicle = express.Router()
const db = require('../database/connection')

// Get all vehicles
vehicle.get("/getVehicles", async (req, res) => {
    const query = "SELECT * FROM vehicles";
    const result = await db(query);
    res.json(result);
});

// Get a single vehicle by ID
vehicle.get("/getVehicle/:id", async (req, res) => {
    const query = `SELECT * FROM vehicles WHERE vehicle_id = ${req.params.id}`;
    const result = await db(query);
    res.json(result[0]); // Return single vehicle
});

// Register a new vehicle
vehicle.post("/registerVehicle", async (req, res) => {
    const {
        license_plate,
        make,
        model,
        year,
        vehicle_type,
        current_mileage,
        fuel_type,
        status,
        last_maintenance_date,
        next_maintenance_date,
        purchase_date,
        purchase_price,
        notes
    } = req.body;

    const query = `
        INSERT INTO vehicles (
            license_plate, make, model, year, vehicle_type, 
            current_mileage, fuel_type, status, last_maintenance_date,
            next_maintenance_date, purchase_date, purchase_price, notes
        ) VALUES (
            '${license_plate}', '${make}', '${model}', ${year}, '${vehicle_type}',
            ${current_mileage || 'NULL'}, '${fuel_type}', '${status || 'available'}',
            ${last_maintenance_date ? `'${last_maintenance_date}'` : 'NULL'},
            ${next_maintenance_date ? `'${next_maintenance_date}'` : 'NULL'},
            ${purchase_date ? `'${purchase_date}'` : 'NULL'},
            ${purchase_price || 'NULL'},
            ${notes ? `'${notes.replace(/'/g, "''")}'` : 'NULL'}
        )
    `;

    const result = await db(query);
    res.json(result);
});

// Update a vehicle
vehicle.post("/updateVehicle", async (req, res) => {
    const {
        vehicle_id,
        license_plate,
        make,
        model,
        year,
        vehicle_type,
        current_mileage,
        fuel_type,
        status,
        last_maintenance_date,
        next_maintenance_date,
        purchase_date,
        purchase_price,
        notes
    } = req.body;

    const query = `
        UPDATE vehicles SET
            license_plate = '${license_plate}',
            make = '${make}',
            model = '${model}',
            year = ${year},
            vehicle_type = '${vehicle_type}',
            current_mileage = ${current_mileage || 'NULL'},
            fuel_type = '${fuel_type}',
            status = '${status || 'available'}',
            last_maintenance_date = ${last_maintenance_date ? `'${last_maintenance_date}'` : 'NULL'},
            next_maintenance_date = ${next_maintenance_date ? `'${next_maintenance_date}'` : 'NULL'},
            purchase_date = ${purchase_date ? `'${purchase_date}'` : 'NULL'},
            purchase_price = ${purchase_price || 'NULL'},
            notes = ${notes ? `'${notes.replace(/'/g, "''")}'` : 'NULL'}
        WHERE vehicle_id = ${vehicle_id}
    `;

    const result = await db(query);
    res.json(result);
});

// Delete a vehicle
vehicle.delete("/removeVehicle/:id", async (req, res) => {
    const query = `DELETE FROM vehicles WHERE vehicle_id = ${req.params.id}`;
    const result = await db(query);
    res.json(result);
});

// Get vehicles that need maintenance soon
vehicle.get("/vehicles/maintenanceDue", async (req, res) => {
    const thresholdDays = req.query.days || 7; // default 7 days
    const query = `
        SELECT * FROM vehicles 
        WHERE next_maintenance_date IS NOT NULL 
        AND next_maintenance_date <= DATE_ADD(CURDATE(), INTERVAL ${thresholdDays} DAY)
        AND status != 'out_of_service'
    `;
    const result = await db(query);
    res.json(result);
});

module.exports = vehicle;
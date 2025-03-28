const express = require('express')
const maintenanceFleet = express.Router()
const db = require('../database/connection')
const formatDate = require('../utils/global')
// Get all maintenance records
maintenanceFleet.get("/getMaintenance", async (req, res) => {
    const query = "SELECT * FROM maintenance";
    const result = await db(query);
    res.json(result);
});

// Get maintenance by ID
maintenanceFleet.get("/getMaintenance/:id", async (req, res) => {
    const query = `SELECT * FROM maintenance WHERE maintenance_id = ${req.params.id}`;
    const result = await db(query);
    res.json(result[0]);
});

// Get maintenance by vehicle ID
maintenanceFleet.get("/getVehicleMaintenance/:vehicleId", async (req, res) => {
    const query = `SELECT * FROM maintenance WHERE vehicle_id = ${req.params.vehicleId}`;
    const result = await db(query);
    res.json(result);
});

// Create new maintenance record
maintenanceFleet.post("/registerMaintenance", async (req, res) => {
    const {
        vehicle_id,
        maintenance_type,
        description,
        scheduled_date,
        completed_date,
        cost,
        service_provider,
        technician_name,
        status,
        mileage,
        notes
    } = req.body;

    const query = `
        INSERT INTO maintenance (
            vehicle_id, maintenance_type, description, scheduled_date,
            completed_date, cost, service_provider, technician_name,
            status, mileage, notes
        ) VALUES (
            ${vehicle_id}, '${maintenance_type}', '${description.replace(/'/g, "''")}', 
            '${formatDate(scheduled_date)}', ${completed_date ? `'${formatDate(completed_date)}'` : 'NULL'}, 
            ${cost || 'NULL'}, ${service_provider ? `'${service_provider.replace(/'/g, "''")}'` : 'NULL'}, 
            ${technician_name ? `'${technician_name.replace(/'/g, "''")}'` : 'NULL'}, 
            '${status || 'scheduled'}', ${mileage || 'NULL'}, 
            ${notes ? `'${notes.replace(/'/g, "''")}'` : 'NULL'}
        )
    `;

    const result = await db(query);
    res.json(result);
});

// Update maintenance record
maintenanceFleet.post("/updateMaintenance", async (req, res) => {
    const {
        maintenance_id,
        vehicle_id,
        maintenance_type,
        description,
        scheduled_date,
        completed_date,
        cost,
        service_provider,
        technician_name,
        status,
        mileage,
        notes
    } = req.body;

    const query = `
        UPDATE maintenance SET
            vehicle_id = ${vehicle_id},
            maintenance_type = '${maintenance_type}',
            description = '${description.replace(/'/g, "''")}',
            scheduled_date = '${formatDate(scheduled_date)}',
            completed_date = ${completed_date ? `'${formatDate(completed_date)}'` : 'NULL'},
            cost = ${cost || 'NULL'},
            service_provider = ${service_provider ? `'${service_provider.replace(/'/g, "''")}'` : 'NULL'},
            technician_name = ${technician_name ? `'${technician_name.replace(/'/g, "''")}'` : 'NULL'},
            status = '${status || 'scheduled'}',
            mileage = ${mileage || 'NULL'},
            notes = ${notes ? `'${notes.replace(/'/g, "''")}'` : 'NULL'}
        WHERE maintenance_id = ${maintenance_id}
    `;

    const result = await db(query);
    res.json(result);
});

// Delete maintenance record
maintenanceFleet.delete("/removeMaintenance/:id", async (req, res) => {
    const query = `DELETE FROM maintenance WHERE maintenance_id = ${req.params.id}`;
    const result = await db(query);
    res.json(result);
});

// Get upcoming maintenance
maintenanceFleet.get("/maintenance/upcoming", async (req, res) => {
    const days = req.query.days || 7; // Default to next 7 days
    const query = `
        SELECT * FROM maintenance 
        WHERE status IN ('scheduled', 'in_progress')
        AND scheduled_date <= DATE_ADD(CURDATE(), INTERVAL ${days} DAY)
        ORDER BY scheduled_date ASC
    `;
    const result = await db(query);
    res.json(result);
});

module.exports = maintenanceFleet;
const express = require('express');
const reservation = express.Router();
const db = require('../database/connection');
const formatToSQLDateTime = (dateTime)=> {
    if (!dateTime) return "";
  
    // Convert string or Date object to a Date instance
    const dateObj = new Date(dateTime);
  
    // Ensure valid date
    if (isNaN(dateObj.getTime())) return "Invalid date";
  
    // Format to "YYYY-MM-DD HH:MM:SS"
    const formattedDate = dateObj
      .toISOString()
      .slice(0, 19) // Get YYYY-MM-DDTHH:MM:SS
      .replace("T", " "); // Replace T with space
  
    return formattedDate;
  };
// Get all reservations with vehicle details
reservation.get("/getReservations", async (req, res) => {
    const query = `
        SELECT 
            r.*, 
            CONCAT(v.make, ' ', v.model, ' (', v.year, ')') as vehicle_name,
            v.license_plate,
            v.vehicle_type,
            v.status as vehicle_status
        FROM reservations r
        INNER JOIN vehicles v ON r.vehicle_id = v.vehicle_id
        ORDER BY r.start_date DESC
    `;
    const result = await db(query);
    res.json(result);
});

// Get reservations by status
reservation.get("/getReservationsByStatus/:status", async (req, res) => {
    const { status } = req.params;
    const query = `
        SELECT 
            r.*, 
            CONCAT(v.make, ' ', v.model, ' (', v.year, ')') as vehicle_name,
            v.license_plate
        FROM reservations r
        INNER JOIN vehicles v ON r.vehicle_id = v.vehicle_id
        WHERE r.status = '${status}'
        ORDER BY r.start_date DESC
    `;
    const result = await db(query);
    res.json(result);
});

// Get reservations by vehicle ID
reservation.get("/getReservationsByVehicle/:vehicle_id", async (req, res) => {
    const { vehicle_id } = req.params;
    const query = `
        SELECT 
            r.*, 
            CONCAT(v.make, ' ', v.model, ' (', v.year, ')') as vehicle_name,
            v.license_plate
        FROM reservations r
        INNER JOIN vehicles v ON r.vehicle_id = v.vehicle_id
        WHERE r.vehicle_id = ${vehicle_id}
        ORDER BY r.start_date DESC
    `;
    const result = await db(query);
    res.json(result);
});

// Create new reservation
reservation.post("/createReservation", async (req, res) => {
    const { vehicle_id, user_name, purpose, start_date, end_date } = req.body;
    
    // Check vehicle availability
    const availabilityCheck = await db(`
        SELECT status FROM vehicles WHERE vehicle_id = ${vehicle_id}
    `);
    
    if (availabilityCheck.length === 0) {
        return res.json({ error: "Vehicle not found" });
    }
    
    if (availabilityCheck[0].status !== 'available') {
        return res.json({ error: "Vehicle is not available for reservation" });
    }
    
    // Check for overlapping reservations
    const overlapCheck = await db(`
        SELECT reservation_id FROM reservations 
        WHERE vehicle_id = ${vehicle_id}
        AND status NOT IN ('rejected', 'cancelled', 'completed')
        AND (
            ('${formatToSQLDateTime(start_date)}' BETWEEN start_date AND end_date)
            OR ('${formatToSQLDateTime(end_date)}' BETWEEN start_date AND end_date)
            OR (start_date BETWEEN '${formatToSQLDateTime(start_date)}' AND '${formatToSQLDateTime(end_date)}')
        )
    `);
    
    if (overlapCheck.length > 0) {
        return res.json({ error: "Vehicle already reserved for this time period" });
    }
    
    // Create reservation
    const createQuery = `
        INSERT INTO reservations 
        (vehicle_id, user_name, purpose, start_date, end_date) 
        VALUES 
        (${vehicle_id}, '${user_name}', '${purpose}', '${formatToSQLDateTime(start_date)}', '${formatToSQLDateTime(end_date)}')
    `;
    
    try {
        const result = await db(createQuery);
        
        // Update vehicle status if reservation is approved immediately
        if (req.body.status === 'approved') {
            await db(`
                UPDATE vehicles 
                SET status = 'in_use' 
                WHERE vehicle_id = ${vehicle_id}
            `);
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to create reservation" });
    }
});

// Update reservation status
reservation.post("/updateReservationStatus", async (req, res) => {
    const { reservation_id, status, approved_by } = req.body;
    
    // Get current reservation and vehicle info
    const currentRes = await db(`
        SELECT r.vehicle_id, r.status as current_status, v.status as vehicle_status 
        FROM reservations r
        JOIN vehicles v ON r.vehicle_id = v.vehicle_id
        WHERE r.reservation_id = ${reservation_id}
    `);
    
    if (currentRes.length === 0) {
        return res.json({ error: "Reservation not found" });
    }
    
    const { vehicle_id, current_status, vehicle_status } = currentRes[0];
    
    // Validate status transition
    if (status === 'approved' && vehicle_status !== 'available') {
        return res.json({ error: "Vehicle is not available for reservation" });
    }
    
    // Update reservation status
    const updateQuery = `
        UPDATE reservations 
        SET status = '${status}'
        ${approved_by ? `, approved_by = '${approved_by}'` : ''}
        WHERE reservation_id = ${reservation_id}
    `;
    
    try {
        const result = await db(updateQuery);
        
        // Update vehicle status if needed
        if (status === 'approved') {
            await db(`
                UPDATE vehicles 
                SET status = 'in_use' 
                WHERE vehicle_id = ${vehicle_id}
            `);
        } else if (current_status === 'approved' && (status === 'rejected' || status === 'cancelled')) {
            await db(`
                UPDATE vehicles 
                SET status = 'available' 
                WHERE vehicle_id = ${vehicle_id}
            `);
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to update reservation status" });
    }
});

// Complete reservation (with mileage and actual dates)
reservation.post("/completeReservation", async (req, res) => {
    const { 
        reservation_id, 
        actual_start_date, 
        actual_end_date, 
        mileage_before, 
        mileage_after 
    } = req.body;
    
    // Get vehicle ID from reservation
    const resInfo = await db(`
        SELECT vehicle_id FROM reservations WHERE reservation_id = ${reservation_id}
    `);
    
    if (resInfo.length === 0) {
        return res.json({ error: "Reservation not found" });
    }
    
    const vehicle_id = resInfo[0].vehicle_id;
    
    const query = `
        UPDATE reservations 
        SET 
            status = 'completed',
            actual_start_date = '${formatToSQLDateTime(actual_start_date)}',
            actual_end_date = '${formatToSQLDateTime(actual_end_date)}',
            mileage_before = ${mileage_before},
            mileage_after = ${mileage_after}
        WHERE reservation_id = ${reservation_id};
        
        UPDATE vehicles 
        SET 
            status = 'available',
            current_mileage = ${mileage_after}
        WHERE vehicle_id = ${vehicle_id};
    `;
    
    try {
        const result = await db(query);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to complete reservation" });
    }
});

// Update reservation details
reservation.post("/updateReservation", async (req, res) => {
    const { 
        reservation_id,
        vehicle_id,
        user_name,
        purpose,
        start_date,
        end_date,
        status
    } = req.body;
    
    // Check for overlapping reservations (excluding current one)
    const overlapCheck = await db(`
        SELECT reservation_id FROM reservations 
        WHERE vehicle_id = ${vehicle_id}
        AND reservation_id != ${reservation_id}
        AND status NOT IN ('rejected', 'cancelled', 'completed')
        AND (
            ('${formatToSQLDateTime(start_date)}' BETWEEN start_date AND end_date)
            OR ('${formatToSQLDateTime(end_date)}' BETWEEN start_date AND end_date)
            OR (start_date BETWEEN '${formatToSQLDateTime(start_date)}' AND '${formatToSQLDateTime(end_date)}')
        )
    `);
    
    if (overlapCheck.length > 0) {
        return res.json({ error: "Vehicle already reserved for this time period" });
    }
    
    const query = `
        UPDATE reservations 
        SET 
            vehicle_id = ${vehicle_id},
            user_name = '${user_name}',
            purpose = '${purpose}',
            start_date = '${formatToSQLDateTime(start_date)}',
            end_date = '${formatToSQLDateTime(end_date)}',
            status = '${status}'
        WHERE reservation_id = ${reservation_id}
    `;
    
    try {
        const result = await db(query);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to update reservation" });
    }
});

// Delete reservation
reservation.delete("/deleteReservation/:reservation_id", async (req, res) => {
    const { reservation_id } = req.params;
    
    // Get reservation info to update vehicle status if needed
    const resInfo = await db(`
        SELECT vehicle_id, status FROM reservations WHERE reservation_id = ${reservation_id}
    `);
    
    if (resInfo.length === 0) {
        return res.json({ error: "Reservation not found" });
    }
    
    const { vehicle_id, status } = resInfo[0];
    
    try {
        // Delete reservation
        await db(`DELETE FROM reservations WHERE reservation_id = ${reservation_id}`);
        
        // Update vehicle status if reservation was approved
        if (status === 'approved') {
            await db(`
                UPDATE vehicles 
                SET status = 'available' 
                WHERE vehicle_id = ${vehicle_id}
            `);
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete reservation" });
    }
});
// Cancel reservation
reservation.post("/cancelReservation", async (req, res) => {
    const { reservation_id } = req.body;
    
    try {
        // 1. Get the current reservation and vehicle info
        const currentRes = await db(`
            SELECT r.vehicle_id, r.status as current_status, v.status as vehicle_status 
            FROM reservations r
            JOIN vehicles v ON r.vehicle_id = v.vehicle_id
            WHERE r.reservation_id = ${reservation_id}
        `);
        
        if (currentRes.length === 0) {
            return res.json({ error: "Reservation not found" });
        }
        
        const { vehicle_id, current_status, vehicle_status } = currentRes[0];
        
        // 2. Validate the current status
        if (current_status === 'cancelled') {
            return res.json({ error: "Reservation is already cancelled" });
        }
        
        if (current_status === 'completed') {
            return res.json({ error: "Completed reservations cannot be cancelled" });
        }
        
        // 3. Update the reservation status
        await db(`
            UPDATE reservations 
            SET status = 'cancelled'
            WHERE reservation_id = ${reservation_id}
        `);
        
        // 4. If the reservation was approved, update vehicle status back to available
        if (current_status === 'approved') {
            await db(`
                UPDATE vehicles 
                SET status = 'available' 
                WHERE vehicle_id = ${vehicle_id}
            `);
        }
        
        res.json({ success: true, message: "Reservation cancelled successfully" });
        
    } catch (err) {
        console.error("Error cancelling reservation:", err);
        res.status(500).json({ error: "Failed to cancel reservation" });
    }
});

module.exports = reservation;
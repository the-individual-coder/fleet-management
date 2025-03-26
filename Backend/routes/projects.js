const express = require('express')
const projects = express.Router()
const db = require('../database/connection')
const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(d.getDate()).padStart(2, '0');         // Add leading zero
    return `${year}-${month}-${day}`;
};
// Get all projects
projects.get("/getProjects", async (req, res) => {
    const query = "SELECT * FROM projects";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new project
projects.post("/registerProject", async (req, res) => {
    const { name, description, startDate, endDate, status } = req.body;
    const query = `INSERT INTO projects (name, description, start_date, end_date, status) VALUES ('${name}', '${description}', '${formatDateForInput(startDate)}', '${formatDateForInput(endDate)}', '${status}')`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing project
projects.post("/updateProject", async (req, res) => {
    const { projectID, name, description, startDate, endDate, status } = req.body;
    const query = `UPDATE projects SET name = '${name}', description = '${description}', start_date = '${formatDateForInput(startDate)}', end_date = '${formatDateForInput(endDate)}', status = '${status}' WHERE id = ${projectID}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a project
projects.delete("/removeProject/:id", async (req, res) => {
    const query = `DELETE FROM projects WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});
module.exports = projects 
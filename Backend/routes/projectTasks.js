const express = require('express')
const projectTasks = express.Router()
const db = require('../database/connection')
const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(d.getDate()).padStart(2, '0');         // Add leading zero
    return `${year}-${month}-${day}`;
};
// Get all project tasks
projectTasks.get("/getProjectTasks", async (req, res) => {
    const query = "SELECT project_tasks.*, projects.name FROM project_tasks inner join projects on projects.id = project_tasks.project_id";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new project task
projectTasks.post("/registerProjectTask", async (req, res) => {
    const { projectID, taskName, assignedTo, dueDate, status } = req.body;
    const query = `INSERT INTO project_tasks (project_id, task_name, assigned_to, due_date, status) VALUES (${projectID}, '${taskName}', '${assignedTo}', '${formatDateForInput(dueDate)}', '${status}')`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing project task
projectTasks.post("/updateProjectTask", async (req, res) => {
    const { taskID, projectID, taskName, assignedTo, dueDate, status } = req.body;
    const query = `UPDATE project_tasks SET project_id = ${projectID}, task_name = '${taskName}', assigned_to = '${assignedTo}', due_date = '${formatDateForInput(dueDate)}', status = '${status}' WHERE id = ${taskID}`;
    console.log(formatDateForInput(dueDate))
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a project task
projectTasks.delete("/removeProjectTask/:id", async (req, res) => {
    const query = `DELETE FROM project_tasks WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

module.exports = projectTasks 
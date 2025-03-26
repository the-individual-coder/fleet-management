const express = require('express')
const documents = express.Router()
const db = require('../database/connection')
// Get all documents
documents.get("/getDocuments", async (req, res) => {
    const query = "SELECT * FROM documents";
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Register a new document
documents.post("/registerDocument", async (req, res) => {
    const { projectID, documentName, uploadDate, filePath } = req.body;
    const query = `INSERT INTO documents (project_id, document_name, upload_date, file_path) VALUES (${projectID}, '${documentName}', '${uploadDate}', '${filePath}')`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Update an existing document
documents.post("/updateDocument", async (req, res) => {
    const { documentID, projectID, documentName, uploadDate, filePath } = req.body;
    const query = `UPDATE documents SET project_id = ${projectID}, document_name = '${documentName}', upload_date = '${uploadDate}', file_path = '${filePath}' WHERE id = ${documentID}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});

// Delete a document
documents.delete("/removeDocument/:id", async (req, res) => {
    const query = `DELETE FROM documents WHERE id = ${req.params.id}`;
    const result = await db(query);
    console.log(result);
    res.json(result);
});
module.exports = documents 
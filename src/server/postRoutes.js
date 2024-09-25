const express = require('express');
const database = require('./connect.cjs');
const ObjectId = require('mongodb').ObjectId;

let postRoutes = express.Router();

// Middleware to parse JSON bodies
postRoutes.use(express.json());

/**
 * GET all data
 */
postRoutes.route("/").get(async (request, response) => {  // No /data here
    try {
        let db = database.getDb();
        let data = await db.collection("App Data").find({}).toArray();

        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Server error" });
    }
});

/**
 * GET data by ID
 */
postRoutes.route("/:id").get(async (request, response) => {  // No /data here
    try {
        let db = database.getDb();
        let data = await db.collection("App Data").findOne({ _id: new ObjectId(request.params.id) });

        if (data) {
            response.json(data);
        } else {
            response.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Server error" });
    }
});

/**
 * POST new data
 */
postRoutes.route("/").post(async (request, response) => {

    try {
        let db = database.getDb();
        let mongoObject = {
            Actions: request.body.Actions
        };

        let result = await db.collection("App Data").insertOne(mongoObject);
        response.status(201).json(result);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error creating data" });
    }
});

/**
 * PUT (update) data by ID
 */
postRoutes.route("/:id").put(async (request, response) => {  // No /data here
    try {
        let db = database.getDb();
        let mongoObject = {
            $set: {
                Actions: request.body.Actions

            }
        };

        let result = await db.collection("App Data").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);

        if (result.matchedCount > 0) {
            response.json(result);
        } else {
            response.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error updating data" });
    }
});

/**
 * DELETE data by ID
 */
postRoutes.route("/:id").delete(async (request, response) => {  // No /data here
    try {
        let db = database.getDb();
        let result = await db.collection("App Data").deleteOne({ _id: new ObjectId(request.params.id) });

        if (result.deletedCount > 0) {
            response.json(result);
        } else {
            response.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error deleting data" });
    }
});

module.exports = postRoutes;

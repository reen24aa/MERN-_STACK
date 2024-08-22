const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    return client.db("todosdb").collection("todos");
};

//GET TODO
router.get("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

//POST TODO
router.post("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        const { todo } = req.body;

        if (!todo) {
            return res.status(400).json({ error: "Todo text is required" });
        }

        const newTodo = await collection.insertOne({ todo, status: false });
        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        console.error("Error adding todo:", error);
        res.status(500).json({ error: "Failed to add todo" });
    }
});

//DELETE TODO
router.delete("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);

        const result = await collection.deleteOne({ _id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

//PUT TODO
router.put("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const { todo, status } = req.body;

        if (todo === undefined && status === undefined) {
            return res.status(400).json({ error: "Todo text or status is required" });
        }

        const updateFields = {};
        if (todo !== undefined) updateFields.todo = todo;
        if (status !== undefined) updateFields.status = status;

        const result = await collection.updateOne(
            { _id },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "No changes were made" });
        }

        res.status(200).json({ message: "Todo updated successfully" });
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

module.exports = router;


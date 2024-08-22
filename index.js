require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");

const app = express();
app.use(express.json());
const router = require("./routes");
app.use("/api", router);
const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();



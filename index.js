const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
const uri = process.env.DATABASE_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const complainCollection = client.db("whichBook").collection("complain");
    const usersCollection = client.db("whichBook").collection("users");

    // get all complains data
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.status(200).json({
        success: true,
        message: "All Users Data Retrived Successfully!",
        data: result,
      });
    });
    // get all complains datas
    app.get("/users/admin", async (req, res) => {
      const { email } = req.query;
      const result = await usersCollection.findOne({ email });
      res.status(200).json({
        success: true,
        message: "user get successfully",
        data: result,
      });
    });
    // get all complains datas
    app.get("/complains", async (req, res) => {
      const result = await complainCollection.find({ status: true }).toArray();
      res.status(200).json({
        success: true,
        message: "All Complain Data Retrived Successfully!",
        data: result,
      });
    });

    // get all complains datas
    app.get("/complains/action", async (req, res) => {
      const result = await complainCollection.find({ status: false }).toArray();
      res.status(200).json({
        success: true,
        message: "All Complain Data Retrived Successfully!",
        data: result,
      });
    });

    // get single complain data
    app.get("/complains/:id", async (req, res) => {
      const { id } = req.params;
      const result = await complainCollection.findOne({
        _id: new ObjectId(id),
      });
      res.status(200).json({
        success: true,
        message: "Complain Data Retrived Successfully!",
        data: result,
      });
    });

    //complain is updated
    app.patch("/complains/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const filters = { _id: new ObjectId(id) };
      const updated = {
        $set: {
          status: false,
          action: data.action,
        },
      };
      const options = { upsert: true };

      const result = await complainCollection.updateOne(
        filters,
        updated,
        options
      );

      res.status(200).json({
        success: true,
        message: "Citizen Complain on Action is Start",
        data: result,
      });
    });

    // delete complain data
    app.delete("/complains/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const result = await complainCollection.deleteOne(filter);
      res.status(200).json({
        success: true,
        message: "Complain Data Deleted Successfully!",
        data: result,
      });
    });
    // add a complain
    app.post("/add-complain", async (req, res) => {
      const data = req.body;
      const result = await complainCollection.insertOne(data);
      res.status(200).json({
        success: true,
        message: "Complain Add Successfully",
        data: result,
      });
    });

    app.post("/add-user", async (req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.status(200).json({
        success: true,
        message: "Users Add Successfully",
        data: result,
      });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", async (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: "Welcome to Dhaka Traffic Watch By Citizen Server",
  });
});

app.listen(port, () =>
  console.log(`Dhaka Traffic server is running on ${port}`)
);

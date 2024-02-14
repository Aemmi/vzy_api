const { MongoClient, ServerApiVersion } = require('mongodb');
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;

const uri = `mongodb+srv://${db_username}:${db_password}@cluster0.lcznr2x.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }catch(e){
    console.log("Error connecting to mongoDb!");
  }
}

const dbName = "vzy_database";
const database = client.db(dbName);

run().catch(console.dir);

module.exports = database;
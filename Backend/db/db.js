const { MongoClient } = require("mongodb");

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL;

// Replace the uri string with your connection string.
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER_URL}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

module.exports = {
    client: new MongoClient(uri),
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_CLUSTER_URL
}
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { query } = require('express');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//user : somyia1
//pass : hHz6bvPU0gg3Iq75

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15s5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("geniusCarMechanic");
        const serviceCollection = database.collection("services");

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('post hitted', req.body)

            const result = await serviceCollection.insertOne(service)
            console.log(result)
            res.json(service)
        })

        //get api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.json(result)
        })


        //delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result)
        })

        // create a document to insert

        //const result = await haiku.insertOne(doc);
        //console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Genius car mechanic server')
})

app.listen(port, () => {
    console.log('listening from port: ', 5000)
})
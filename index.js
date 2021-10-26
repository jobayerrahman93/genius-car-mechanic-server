const express = require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors');
const app=express();
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;
const port=process.env.port || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipq6z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();

        const database = client.db("carMechanics");
        const serviceCollection = database.collection("services");

        // get api

        app.get('/services',async(req,res)=>{

            const cursor = await serviceCollection.find({}).toArray();
            res.send(cursor);
            
        })


        // get single service

        app.get('/services/:id',async(req,res)=>{

            console.log("hitting services");
            const id=req.params.id;
            console.log("hitting ",id);

            const query={_id: ObjectId(id)};

            const SingleService=await serviceCollection.findOne(query);
            console.log(SingleService);
            res.json(SingleService);


        });

        // delete service

        app.delete('/manageServices/:id',async(req,res)=>{
        
            console.log("hitting dlt");
            const id=req.params.id;

            const query={_id: ObjectId(id)}

            const result= await serviceCollection.deleteOne(query);

            res.json(result);


        

        })


        // post api

        app.post('/addServices',async(req,res)=>{


            const service=req.body;
            console.log('hitting services',service);

            const result = await serviceCollection.insertOne(service);

            console.log(result);
            res.json(result);
            

        })
    }
    finally{

    }
}
run().catch(console.dir);



// get
app.get('/',(req,res)=>{
    res.send("yeah it is working");
});

app.listen(port,()=>{
   console.log("server port working",port);
})
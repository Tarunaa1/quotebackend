const express = require("express");
const  mongoclient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");


const app = express();
app.use(cors());

const username = "taruna";
const password = "Taruna@01";
const dbName = "randomquote";

// const CONNECTION_STRING = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cluster0.wlyuys2.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const CONNECTION_STRING =  `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cluster0.wlyuys2.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// const client = new mongoclient(CONNECTION_STRING);

let database ; 
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    const client = new mongoclient(CONNECTION_STRING);
    database = client.db(dbName);
    console.log("Mongodb connected succesfully!");
    }
)
app.get("/test",(req,res)=>{
    res.send("test route working");
})


app.get("/quotes", async (req, res) => {
    try {
        const quotes = await database.collection("quotes").find({}).toArray();
        console.log('Quotes retrieved successfully:');
        res.send(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (error) {
        console.error("Error retrieving quotes:", error);
        res.status(500).send("Internal Server Error");
    }
})


app.post("/addquote", multer().none(), (req,res)=>{
    database.collection("quotes").count({},function(err,numOfDocs){
        database.collection("quotes").insertOne({
            id:(numOfDocs+1).toString(),
            quote : req.body.newQuote,
            author : req.body.name
        });
        res.json("Added Successfully");
    })
})

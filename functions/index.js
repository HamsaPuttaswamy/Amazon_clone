const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")('sk_test_51J8nrkDWH0Vk4WOGC3cLhnamshKoxRAq2OgyHyaZLNDiU8dqg3GtQ1TVaFzw0CCj8As92jJqtBMX3cp0W3UXXx3n00olhLP2r8')

//API


// app config
const app = express();

//middlewares
app.use(cors({origin:true}));

//api routes
// app.get('/',async(request,response) => 
//     response.status(200).send('hello'))

app.post('/payments/create', async (request,response)=>{

    try{
        const total = request.query.total;

        console.log("payment received");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency:"usd",
        });
        response.status(201).send({
            clientSecret : paymentIntent.clientSecret
        });

    } catch(err){
        console.log(err)
        response.status(500).send({ error: "An error occurred while processing your payment" });
    }

})

//listner command
exports.api = functions.https.onRequest(app)

//api end point from emulator 
// http://localhost:5001/clone-23-46b2b/us-central1/api
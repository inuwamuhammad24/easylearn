const express = require('express')
const homeRoute = express.Router() 
const homeControllers = require('../../controllers/homeControllers/homeControllers')
const {OAuth2Client} = require('google-auth-library');
const dotenv = require('dotenv')
dotenv.config()

homeRoute.get('/', homeControllers.home)
homeRoute.post('/login', (req, res) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const user = {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email
    }
    res.json(JSON.stringify(user))
    }
    verify().catch(console.error);
    })

module.exports = homeRoute

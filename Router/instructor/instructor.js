const express = require('express')
const instructorRoute = express.Router()
const instructorControllers = require('../../controllers/instructorControllers/instructorControllers')

instructorRoute.get('/signup', instructorControllers.instructorsSignUp)
instructorRoute.get('/create-topic', instructorControllers.createTopic)

instructorRoute.post('/signup', instructorControllers.signup)
instructorRoute.post('/doesUsernameExist', instructorControllers.doesUserExist)
instructorRoute.post('/doesEmailnameExist', instructorControllers.doesEmailExist)

module.exports = instructorRoute
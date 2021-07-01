const express = require('express')
const topicsRoute = express.Router()

const topisController = require('../../controllers/instructorControllers/topicsController')

topicsRoute.post('/find-all-topics', topisController.findTopics)

module.exports = topicsRoute

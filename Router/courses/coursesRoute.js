const express = require('express')
const courseRoute = express.Router()
const coursesControllers = require('../../controllers/coursesController/coursesController') 

courseRoute.get('/', coursesControllers.courses)

courseRoute.get('/:id', coursesControllers.coursesContent)

module.exports = courseRoute
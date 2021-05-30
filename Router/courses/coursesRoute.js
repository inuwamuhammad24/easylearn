const express = require('express')
const courseRoute = express.Router()
const coursesControllers = require('../../controllers/coursesController/courses') 

courseRoute.get('/', coursesControllers.courses)

courseRoute.get('/:id', coursesControllers.coursesContent)

module.exports = courseRoute
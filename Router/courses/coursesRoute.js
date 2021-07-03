const express = require('express')
const courseRoute = express.Router()
const coursesControllers = require('../../controllers/coursesController/coursesController') 
const instructorControllers = require('../../controllers/instructorControllers/instructorControllers')

courseRoute.get('/', coursesControllers.courses)

courseRoute.get('/:id', coursesControllers.coursesContent)
courseRoute.get('/course/view/:id', instructorControllers.mustBeLoggedIn, coursesControllers.viewCourse)

module.exports = courseRoute
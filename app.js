const express = require('express')
const app = express()
const homeRoute = require('./Router/home/homeRoutes')
const dotenv = require('dotenv')
const coursesRoute = require('./Router/courses/coursesRoute')
const instructorRoute = require('./Router/instructor/instructor')
dotenv.config()

// middlewaresx
app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', homeRoute)
app.use('/course', coursesRoute)
app.use('/instructor', instructorRoute)

app.set('views', 'views')
app.set('view engine', 'ejs')

module.exports = app
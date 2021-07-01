const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const homeRoute = require('./Router/home/homeRoutes')
const dotenv = require('dotenv')
const coursesRoute = require('./Router/courses/coursesRoute')
const instructorRoute = require('./Router/instructor/instructor')
const topicsRoute = require('./Router/instructor/topics')
dotenv.config()

let sessionOptions = session({
    secret: 'One very useful secret oveer this platform',
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true}
})

// middlewares
app.use(sessionOptions)
app.use(flash())
app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({extended: true, limit: '50mb', parameterLimit:50000}))
app.use(express.json({limit: '50mb'}))
app.use('/', homeRoute)
app.use('/course', coursesRoute)
app.use('/instructor', instructorRoute)
app.use('/topics', topicsRoute)

app.set('views', 'views')
app.set('view engine', 'ejs')

module.exports = app
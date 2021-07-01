const express = require('express')
const instructorRoute = express.Router()
const instructorControllers = require('../../controllers/instructorControllers/instructorControllers')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')
const dotenv = require('dotenv')
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECTRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'courses',
    allowedFormats: ['jpg', 'svg', 'png'],
})

const parser = multer({ storage, limits: '50mb' })

instructorRoute.get('/signup', instructorControllers.instructorsSignUp)
instructorRoute.get('/create-topic', instructorControllers.mustBeLoggedIn, instructorControllers.createTopicPage)
instructorRoute.post('/create-topic', instructorControllers.createTopic)
instructorRoute.post('/create-course', parser.single('pic'), instructorControllers.createCourse)
instructorRoute.post('/create-new-topic', instructorControllers.createNewTopic)

instructorRoute.post('/signup', instructorControllers.signup)
instructorRoute.post('/doesUsernameExist', instructorControllers.doesUserExist)
instructorRoute.post('/doesEmailnameExist', instructorControllers.doesEmailExist)

module.exports = instructorRoute
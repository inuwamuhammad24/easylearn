const express = require('express')
const homeRoute = express.Router() 
const homeControllers = require('../../controllers/homeControllers/homeControllers')
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
    folder: 'cvs',
    allowedFormats: ['jpg', 'svg', 'png'],
})

const parser = multer({ storage })

homeRoute.get('/', homeControllers.home)
homeRoute.get('/login', homeControllers.loginGet)
homeRoute.post('/login', homeControllers.login)
homeRoute.get('/signout', homeControllers.signout)

homeRoute.post('/uploadContentImage', parser.single('file'), homeControllers.uploadImageContent)

module.exports = homeRoute

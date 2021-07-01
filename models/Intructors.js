const validator = require('validator')
const bcrypt = require('bcryptjs')
const { use } = require('../Router/home/homeRoutes')
const { validate } = require('webpack')
const { ObjectID } = require('bson')
const instructorsCollection = require('../db').db().collection('instructors')
const coursesCollection = require('../db').db().collection('courses')
const topicsCollection = require('../db').db().collection('topics')

let Instructor = function (data) {
    this.data = data
    this.errors = []
}

Instructor.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        // If any of the field is empty
        if (this.data.username.trim() == '') this.errors.push('Username Field cannont be empty')
        if (this.data.email.trim() == '') this.errors.push('Please Enter Your email address')
        if (this.data.firstName.trim() == '') this.errors.push('First name cannot be empty')
        if (this.data.lastName.trim() == '') this.errors.push('Last name cannot be empty')
        if (this.data.password.trim() == '') this.errors.push('Please select a password')

        // validate username and email
        if (!validator.isAlphanumeric(this.data.username)) this.errors.push('Only letters and numbers a accepted')
        if (!validator.isEmail(this.data.email)) this.errors.push('Your email is not valid')

        // validate user password
        if (this.data.password.length < 8) this.errors.push('Password should be atleats Eight character')
        if (this.data.password.length > 30) this.errors.push('Password should not be greater than 50 chracters')


        // check if email exist
        let usernameExists = await instructorsCollection.findOne({username: this.data.username})
        if (usernameExists) this.errors.push("That username is already taken.")

        // check if email exist
        let emailExists = await instructorsCollection.findOne({email: this.data.email})
        if (emailExists) this.errors.push("That email is already taken.")

        resolve()
    }) 
}

Instructor.prototype.cleanup = function() {
    if (typeof(this.data.username) != 'string') this.data.username = ''
    if (typeof(this.data.email) != 'string') this.data.email = ''
    if (typeof(this.data.firstName) != 'string') this.data.firstName = ''
    if (typeof(this.data.lastName) != 'string') this.data.lastName = ''
    if (typeof(this.data.password) != 'string') this.data.password = ''

    // get rig of any unauthorized data
    this.data = {
        username: this.data.username,
        email: this.data.email,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        password: this.data.password,
        isVerified: false,
        createdDate: new Date()
    }
}

Instructor.prototype.signup = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanup()
        this.validate().then(() => {
            if (!this.errors.length) {
                let salt = bcrypt.genSaltSync(10)
                this.data.password = bcrypt.hashSync(this.data.password, salt)
                instructorsCollection.insertOne(this.data).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            }).catch(() => {
                reject()
            })
            } else {
                reject(this.errors)
            }
        })
    })
}


Instructor.prototype.login = function() {
    return new Promise((resolve, reject) => {
        if (typeof(this.data.email) != 'string') this.data.email = ''
        if (typeof(this.data.password) != 'string') this.data.password = ''
        if (this.data.email == '') this.errors.push('Username field cannot be empty')
        if (this.data.password == '') this.errors.push('Password field cannot be empty')
        if (!this.errors.length) {
            instructorsCollection.findOne({email: this.data.email}).then((data) => {
                if (data && bcrypt.compareSync(this.data.password, data.password)) {
                    resolve(data)
                } else {
                    reject('Invalid login Credentials')
                }
            }).catch((err) => {
                reject('Please try again later')
            })
        } else {
            reject(this.errors)
        }
    })
}

Instructor.doesUserExist = function (username) {
    return new Promise((resolve, reject) => {
        instructorsCollection.findOne({username: username}).then((data) => {
            if (data) {
                reject(`That username has already been taken`)
            } else {
                resolve()
            }
        })
    })
}

Instructor.doesEmailExist = function (email) {
    return new Promise((resolve, reject) => {
        instructorsCollection.findOne({email}).then((data) => {
            if (data) {
                reject(`That email has already been used`)
            } else {
                resolve()
            }
        })
    })
}

Instructor.findRandomTopics = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let topics = await coursesCollection.aggregate([
                {$sample: {size: 8}}
            ]).toArray()
            if (topics) {
                resolve(topics)
            } else {
                reject()
            }
        } catch (err) {
            reject()
        }
    })
}

Instructor.allTopics = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let topics = await coursesCollection.find().toArray()
            if (topics) {
                resolve(topics)
            } else {
                reject()
            }
        } catch (err) {
            reject()
        }
    })
}

Instructor.uploadCourse = function (file, body, authorid) {
    return new Promise((resolve, reject) => {
        if (typeof(file.courseName) != 'string' || typeof(body.isFree) != 'string' || body.courseName == '' || file.path == '' || !ObjectID.isValid(authorid)) reject()
        let isFree = false
        if (body.isFree == 'on') isFree = true
        coursesCollection.insertOne({name: body.courseName, pic: file.path, isFree: isFree, authorId: ObjectID(authorid), date: new Date()})
    })
}

Instructor.findAuthorDocs = function(id) {
    return new Promise(async (resolve, reject) => {
        let courses = await coursesCollection.find({authorId: ObjectID(id)}).toArray()
        if (courses) {
            resolve(courses)
        } else {
            reject()
        }
    
        
    })
}

Instructor.createNewTopic = function(data) {
    return new Promise((resolve, reject) => {
        let error = []
        if (typeof(data.topicName) != 'string' || !ObjectID.isValid(data.course) || !ObjectID.isValid(data.author)) {
            reject()
            return
        }
        if (data.topicName == '' ) error.push('Please select a topic')
        if (data.course == 'select_course') error.push('Please select a course')

        if (!error.length) {
            topicsCollection.insertOne({name: data.topicName, course: ObjectID(data.course), author: ObjectID(data.author)}).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log(err)
                reject()
            })
        } else {
            reject(error)
        }
    })
}

module.exports = Instructor
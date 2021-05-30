const validator = require('validator')
const bcrypt = require('bcryptjs')
const { use } = require('../Router/home/homeRoutes')
const instructorsCollection = require('../db').db().collection('instructors')

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
        // if (!validator.isAlphaNumeric(this.data.username)) this.errors.push('Only letters and numbers a accepted')
        // if (!validator.isEmail(this.data.email)) this.errors.push('Your email is not valid')

        // validate user password
        if (this.data.password < 8) this.errors.push('Password should be atleats Eight character')
        if (this.data.password > 30) this.errors.push('Password should not be greater than 50 chracters')


        // check if email exist
        instructorsCollection.findOne({username: this.data.username}).then((data) => {
            if (data) {
                this.errors.push('That username has already been taken')
            }
            resolve()
        })

        // check if email exist
        instructorsCollection.findOne({email: this.data.email}).then((data) => {
            if (data) {
                this.errors.push('That email has already been taken')
            }
            resolve()
        })
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
        await this.validate()
        
        console.log(this.errors)
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            instructorsCollection.insertOne(this.data).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject(err)
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

module.exports = Instructor
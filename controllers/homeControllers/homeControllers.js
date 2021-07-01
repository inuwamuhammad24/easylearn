const { rawListeners } = require('../../db')
const Instructor = require('../../models/Intructors')

exports.wrongRoute = function(req, res) {
    res.render('404', {isLoggedIn: false})
}

exports.home = (req, res) => {
    if (req.session.user) {
        Instructor.findRandomTopics().then((topics) => {
            res.render('home', {topics, errors: req.flash('errors'), isLoggedIn: true})
        }).catch(() => {
            res.send('An error has occured while fetching the courses')
        })
    } else {
        Instructor.findRandomTopics().then((topics) => {
            res.render('home', {topics, errors: req.flash('errors'), isLoggedIn: false})
        }).catch(() => {
            res.send('An error has occured while fetching the courses')
        })
    }
}


exports.signout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/login')
    })
}

exports.loginGet = function(req, res) {
    if (req.session.user) {
        getAuthorDocs(req.session.user._id).then((courses) => {
            data = req.session.user
            res.render('profile', {data, isLoggedIn: true, courses})
        }).catch((err) => {
            console.log(err)
        })
    } else {
        res.render('login', {errors: req.flash('errors'), success: req.flash('success'), isLoggedIn: false})
    }
}

function getAuthorDocs (id) {
    return new Promise((resolve, reject) => {
        Instructor.findAuthorDocs(id).then((data) => {
            resolve(data)
        }).catch((err) => {
            console.log(err)
        })
    })
}


exports.login = function(req, res) {
    let instructor = new Instructor(req.body)
    instructor.login(req.data).then((data) => {
        req.session.user = data
        req.session.save(() => {
            getAuthorDocs(req.session.user._id).then((courses) => {
                res.render('profile', {data, isLoggedIn: true, courses})
            })
    })
    }).catch(err =>  {
        req.flash('errors', err)
        req.session.save(() => res.redirect('/login'))
    })
}

exports.uploadImageContent = function(req, res) {
    res.json({location: req.file.path})
}
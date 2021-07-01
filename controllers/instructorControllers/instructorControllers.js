const Instructor = require('../../models/Intructors')
const Topic = require('../../models/Topics')


exports.instructorsSignUp = (req, res) => {
    res.render('instructorssign-up', {isLoggedIn: false})
}

exports.signup = (req, res) => {
    let instructor = new Instructor(req.body)
    instructor.signup().then(() => {
        res.send('success')
    }).catch((err) => {
        res.json('Something went wrong')
    })
}

exports.doesUserExist = function (req, res) {
    Instructor.doesUserExist(req.body.username).then((data) => {
        // dont send any response
    }).catch((err) => {
        res.send(err)
    })
}

exports.doesEmailExist = function (req, res) {
    Instructor.doesEmailExist(req.body.email).then((data) => {
        // dont send any response
    }).catch((err) => {
        res.send(err)
    })
}

exports.createTopicPage = (req, res) => {
    Instructor.allTopics().then((topics) => {
        res.render('create-topic', {topics, errors: req.flash('errors'), isLoggedIn: true})
    }).catch(() => {
        res.redirect('/instructor/create-topic')
    })
}

exports.createTopic = (req, res) => {
    let topic = new Topic(req.body)
    topic.createTopic().then((data) => {
       res.redirect(`/course/${data.ops[0]._id}`)
    }).catch(err => {
        req.flash('errors', 'Something went wrong! Please try again later')
        req.session.save(() => {
            res.redirect('/instructor/create-topic')
        })
    })
}

exports.createCourse = function(req, res) {
    // pass the file content, req.body and the author document to the model
    Instructor.uploadCourse(req.file, req.body, req.session.user._id).then((data) => {
        resolve(data)
    }).catch(() => {
        req.flash('errors', 'We cannot create your course')
        req.session.save(() => res.redirect('/instructor/create-topic'))
    })
}

exports.createNewTopic = function(req, res) {
    Instructor.createNewTopic(req.body).then((data) => {
        console.log(data)
        res.redirect('/login')
    }).catch((err) => {
        res.send("Try again later")
    })
}


exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash('errors', 'Access denied! Please login first')
        req.session.save(() => res.redirect('/login'))
    }
}
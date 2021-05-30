const Instructor = require('../../models/Intructors')


exports.instructorsSignUp = (req, res) => {
    res.render('instructorssign-up')
}

exports.signup = (req, res) => {
    let instructor = new Instructor(req.body)
    instructor.signup().then((data) => {
        res.send('success')
    }).catch((err) => {
        res.json(err)
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

exports.createTopic = (req, res) => {
    res.render('create-topic')
}
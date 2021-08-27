const { render, response } = require('../../app')
const Course = require('../../models/Courses')

exports.courses = (req, res) => {
    let isLoggedIn = false
    if (req.session.user) isLoggedIn = true
    Course.findAllCourses().then((courses) => {
        res.render('courses', {isLoggedIn, courses: courses})
    }).catch(err => console.log(err))
}

exports.coursesContent = async (req, res) => {
    let isLoggedIn = false
    if (req.session.user) isLoggedIn = true
   Course.findContentById(req.params.id).then((data) => {
       res.render('topicContent', {
           content: data[0],
           relatedTitles: data[2],
           course: data[3],
           mainTopic: data[1],
           isLoggedIn
       })
   }).catch(() => {
       res.render('404', {isLoggedIn})
   })
}

exports.viewCourse = function(req, res) {
    res.send('You will view all Your topics soon')
}
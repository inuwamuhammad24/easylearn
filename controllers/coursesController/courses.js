exports.courses = (req, res) => {
    res.send('Thank you for visiting our courses page')
}

exports.coursesContent = (req, res) => {
    res.render('courseContent')
}
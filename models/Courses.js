const ObjectID = require('mongodb').ObjectID

const topicsContentCollection = require('../db').db().collection('topicsContent')
const coursesCollection = require('../db').db().collection('courses')
const subtopicsCollection = require('../db').db().collection('topics')

function Course () {

}

Course.findAllCourses = function() {
    return new Promise((resolve, reject) => {
        coursesCollection.find({}).toArray().then((courses) => {
            resolve(courses)
        }).catch(err => reject(err))
    })
}

Course.findContentById = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject()
            return
        }
        let result = []
        const data = await topicsContentCollection.findOne({_id: ObjectID(id)})
        if (data) {
            result.push(data)
            const topics = await subtopicsCollection.findOne({_id: ObjectID(data.topic)})
            result.push(topics)
            const projection = {_id: 1, title: 1, course: 1, topic: 1}
            const relatedTitles = await topicsContentCollection.find({topic: ObjectID(data.topic)}).project(projection).toArray()
            result.push(relatedTitles)
            const courses = await coursesCollection.findOne({_id: ObjectID(data.course)})
            result.push(courses)
            resolve(result)
        } else {
            reject()
        }
    })
}

module.exports = Course
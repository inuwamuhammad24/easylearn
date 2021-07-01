const sanitizer = require('sanitize-html')
const topicsContentCollection = require('../db').db().collection('topicsContent')
const titleCollection = require('../db').db().collection('topics')
const ObjectID = require('mongodb').ObjectID

function Topic(data) {
    this.data = data,
    this.errors = []
}

Topic.prototype.validate = function () {
    if (this.data.title == '') this.errors.push('Title field empty')
    if (this.data.course == 'select_a_course') this.errors.push('Please select a course')
    if (this.data.textarea == '') this.errors.push('Contents cannot be empty')
    if (this.data.topic == '') this.errors.push('Please select a topic')
}

Topic.prototype.cleanup = function() {
    console.log(typeof(this.data.course))
    console.log(this.data)
    if (typeof(this.data.title) != 'string') this.errors.push('Sorry! There was a problem')
    if (typeof(this.data.textarea) != 'string') this.errors.push('Sorry! There was a problem')
    console.log(ObjectID.isValid(this.data.course))
    console.log(ObjectID.isValid('60c72b13dfda3d12610b5ec0'))

    this.data = {
        title: sanitizer(this.data.title, {
            allowedTags: ["h1", "h2", "h3", "h4","h5", "h6", "p", "pre","em", "strong"],
            allowedAttributes: {},
        }),
        course: ObjectID(this.data.course),
        topic: ObjectID(this.data.topics),
        textarea: sanitizer(this.data.textarea, {
            allowedTags: [
                "h1", "h2", "h3", "h4",
                "h5", "h6", "blockquote", "dd", "div",
                "dl", "dt", "figcaption", "hr", "li", "ol", "p", "pre",
                "ul", "a", "abbr", "b", "br", "code",
                "em", "i", "small", "span", "strong", "sub", "sup", "time", "caption",
                "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", 'iframe', 'img'
              ],
            allowedAttributes: {'a': ['href', 'src'], 'img': ['src'], 'iframe': ['src', 'allowfullscreen', 'width', 'scrolling', 'height']},
            // allowedIframeHostnames: ['www.youtube.com', 'https://phet.colorado.edu']
        }),
        date: new Date()
    }
}

Topic.prototype.createTopic = function() {
    return new Promise((resolve, reject) => {
        this.validate()
        if (!this.errors.length) {
            this.cleanup()
        } else {
            reject(this.errors)
            return
        }
        if (!this.errors.length) {
            topicsContentCollection.insertOne(this.data).then((data) => {
                resolve(data)
            }).catch(() => reject('Please try again later'))
        } else {
            console.log(this.errors)
            reject(this.errors)
        }
    })
}

Topic.findAllTopics = function(course) {
    return new Promise(async (resolve, reject) => {
        titleCollection.find({course: ObjectID(course)}).toArray().then((data) => {
            if (data) {
                resolve(data)
            } else {
                reject('We cannot find any course')
            }
        }).catch((err) => {
            reject()
        })
    })
}

module.exports = Topic
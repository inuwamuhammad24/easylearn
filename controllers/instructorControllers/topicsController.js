const Topics = require('../../models/Topics')

exports.findTopics = function(req, res) {
    Topics.findAllTopics(req.body.course).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.send(err)
    })
    
}
const mongodb = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

mongodb.connect(process.env.CONNECTDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) throw err
    module.exports = client
    const app = require('./app')
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`Server running on port ${port}. Press ctr C to quite`))
    module.exports = client
})


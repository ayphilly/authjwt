const express = require ('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

//connect to db
mongoose.connect(
    process.env.DB_CONNECT,
{ useNewUrlParser: true }
).catch(err=> {
    console.log('db connection failed')
})
var db= mongoose.connection;
db.on('open',()=> {
    console.log('db connected')
})




//IMPORTING ROUTERS
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

const app = express()
const PORT = 3500

//middleware
app.use(express.json())

app.use('/api/user',authRoute)
app.use('/api/post',postRoute)
app.listen(PORT, ()=> {
    console.log(`server runn at  ${PORT} time ${Date.now()}`)
})

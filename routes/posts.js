const router = require('express').Router();
const authToken = require('./verifyToken')
const User = require('../model/user')
const posts = {
    title : 'first post',
    description : 'first post init',
    time : Date.now()
}
router.get('/', authToken, (req, res)=> {
    //res.json(posts)
    console.log(req.user)
    User.findOne({_id : req.user.id}).then(response => {
        res.status(200).send(response)        
    }).catch( error => {
        if (error) console.log(error)
    })
})

module.exports =router;
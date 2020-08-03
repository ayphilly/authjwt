const router = require('express').Router();
const User = require('../model/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async (req, res)=> {
    
    //lets validate our data
    const {error} = registerValidation(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }    
    //checking if user is already in db
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) {
        return res.status(400).send('email already exists')
    }

    //hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt) 
        
    //create new user
    var data = {
        name : req.body.name,
        email : req.body.email,
        password :  hashedPassword,
    }

    User.create(data).then( (response) => {
        if (response) {

            res.status(201).send(response._id)
            return;
        }
        
    }, (error)=> {
        if (error) {
            res.status(400).send('error creating user'. error)
            return;
        }
    }).catch (err=> {
        res.status(400).send('error creating user'. error)
        return;

    })
    

})

//login
router.post('/login', async (req, res)=> {

    const {error} =  await loginValidation(req.body)
    //console.log(req.body)
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    //check if email exists
    const query = {
        email: req.body.email
    }
    User.findOne(query).then(async (response) => {
        const validPass = await bcrypt.compare(req.body.password, response.password).catch(err => console.log('error'))
        if (!validPass) {            
            return res.status(400).send(' INVALID PASSWORD')
        }
        //create and assign token

        const token = jwt.sign({id : response._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'}) 
        res.header('auth-token', token).send(token)
        //return res.status(200).send(`Welcome back ${response.name}`)
        
    }).catch ( err=> {
        return res.status(400).send('EMAIL INVALID')
    })
    
})


module.exports = router

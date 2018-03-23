const express =require ('express');
const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const router = express.Router();

// load user model
require('../models/user');
const userSaved = mongoose.model('users');

/* 
route for login
*/
router.get('/', (req,res)=>{
    res.send('login');
});
/*
 *type: get
 *params : string
 *function : to fetch username to validate 
 */
router.get('/:username',(req,res)=>{
    console.log(req.params.username);
    const usernameInQuestion=req.params.username;
     userSaved.findOne({username:usernameInQuestion})
    .then(user =>{
        if(user){
            res.status(200).send({'success':true,'message':'Username Is already taken'});
        }
        else{
            res.status(200).send({'success':true,'message':'Congrats!!Your Username is Valid!'})
        }
    })
})
/* 
route for Register
*/
router.post('/', (req,res)=>{
    console.log(req.body);
    if(req.body !== undefined && req.body !== {} && req.body !== null)
    {
        const body = req.body;
        
    
    const newUSer = new userSaved({
        name:body.name,
        username:body.username,
        password:body.password
    });
    bcrypt.genSalt(10,(error,salt)=>{
        bcrypt.hash(newUSer.password,salt,(error,hash)=>{
            if(error) throw error;
            newUSer.password=hash;
            newUSer.save()
            .then(user=>{
                //req.flash('success_msg', 'You are now registered and can log in');
                res.status(200).send({'user':user});
            })
            .catch(err=>{
                console.log(err);
            })
        })
    })
}
else{
    res.sendStatus(404);
}   
});

module.exports = router;
const express = require ('express');
const mongoose =require('mongoose');
const routes = express.Router();

require('../models/cityList');
const city = mongoose.model('cityWeatherData');
routes.get('/:cityName', (req,res)=>{
    
    var err=false;
    var errorText={};
    let params= req.params.cityName;
    console.log(params);
    city.find({"name":params})
    .then(cities =>{
        res.status(200).send({'success':true,'result':cities});
    })
    .catch(error=>{
        console.log(error)
        err= true;
        errorText=error;
    })
    
        if(err){
            return res.json({'status':'data not found','success':false, 'msg':'error while reading the db','error':errorText});
        }        
        
    
})
module.exports = routes;
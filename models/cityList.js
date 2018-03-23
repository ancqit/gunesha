const mongoose =require('mongoose');
const schema =mongoose.Schema;

let cityWeatherData = new schema ({
    
});
let cityData = new schema({      
    
        id:{
            type:Number,        
        },
        name:{
            type:String
        },
        country:{
            type:String
        },
        coord:{
         type:Object,   
            lon:{
                type:Number
            },
            lat:{
                type:Number
            }               
}
},{ collection : 'city.list' })
module.exports = mongoose.model('cityWeatherData',cityData);
const mongoose =require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
mongoose.model('users',UserSchema);
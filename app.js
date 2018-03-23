const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const flash = require ('connect-flash');
const session = require ('express-session');
const mongoose = require('mongoose');


const app = express();
// middleware express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
 
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//static folder
app.use(express.static('public'));

const routes = require('./routes/weatherRoutes');
app.use('/cities', routes);
const loginRoute =require('./routes/login');
app.use('/login',loginRoute);
mongoose.promise = global.Promise;

mongoose.connect('mongodb://localhost/gunesha-dev')
    .then(() => console.log('Mongodb connected...'))
    .catch(err => console.log(err));

require('./models/idea');
const idea = mongoose.model('ideas');

//global variables
  app.use(function(req,res,next){
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  })

// handlebars middleware { use handlebars }
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');



 

const port = 5000;


app.use((req, res, next) => {
    req.name = 'ankit bhargav';
    req.password = "sachin";  

    next();
});


app.get('/', (req, res) => {
    console.log('home ' + req.name);
    res.render('index');
});
app.get('/city.list',(req,res)=>{
    console.log('front-end hitting');
    res.json({'status':'we are connected'});
})
require('./models/cityList');
const city = mongoose.model('cityWeatherData');
// const newCity={
//     id : 123452,
//     name:"Sunita's Gotham",
//     country:"IN",
//     coord:{
//         lat:12.34,
//         lon:23.45
//     }
// }
// new city (newCity)
// .save()
// .then(city=>{
//     console.log(city);
// })

// app.get ('/cities/:cityName', (req,res)=>{
    
//     var err=false;
//     var errorText={};
//     let params= req.params.cityName;
//     console.log(params);
//     city.find({"name":params})
//     .then(cities =>{
//         res.status(200).send({'success':true,'result':cities});
//     })
//     .catch(error=>{
//         console.log(error)
//         err= true;
//         errorText=error;
//     })
    
//         if(err){
//             return res.json({'status':'data not found','success':false, 'msg':'error while reading the db','error':errorText});
//         }        
        
    
// })


app.get('/about', (req, res) => {
    res.render('about', {
        ankit: req.name
    });
});
// add idea form
app.get ('/ideas/add',(req, res)=>{
    res.render('ideas/add');
});
app.get('/ideas',(req,res)=>{
    idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })
    
})

//process form
app.post('/ideas',(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({text: 'please add a title' });
    }
    if(!req.body.details){
        errors.push({text:'please enter details'});
    }
    if(errors.length>0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }
    else {
        const newUser = {
            title:req.body.title,
            details:req.body.details
        }
        new idea(newUser)
        .save()
        .then(idea=>{
            res.redirect('/ideas');
        })
    }
    //res.send(req.body);
});

app.get('/aboutme', (req, res) => {
    res.render('aboutme', {
        username: req.name,
        password: req.password
    })
});
app.listen(port, "0.0.0.0", () => {
    console.log(`Server started on port ${port}`);
});


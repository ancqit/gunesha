const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

mongoose.promise = global.Promise;

mongoose.connect('mongodb://localhost/gunesha-dev')
    .then(() => console.log('Mongodb connected...'))
    .catch(err => console.log(err));

require('./models/idea');
const idea = mongoose.model('ideas');

// handlebars middleware { use handlebars }
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


app.use((req, res, next) => {
    req.name = 'ankit bhargav';
    req.password = "sachin";
    next();
});


app.get('/', (req, res) => {
    console.log('home ' + req.name);
    res.render('index');
});


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



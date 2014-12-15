var express = require('express');
var path = require('path');
var  fileSystem = require('fs');    
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require ('passport-local').Strategy;
var mongoose = require ('mongoose');
var multer  = require('multer'); 
var  cookieParser = require('cookie-parser');
var  expresSession = require('express-session');
var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";
var config = require('./config.js')[env];


var app = express();

require ("./server/mongoose.js")(config);
var routes = require('./routes/index');
var users = require('./routes/users');


var done=false;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use (expresSession({secret:'book monster'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/



//file upload

app.use(
        multer({ 
                    dest: '../public/books/',
                    rename: function (fieldname, filename) {
                                return filename.replace(/\W+/g, '-');
                              }

                })

        );

app.post('/upload',function (req , res ) { 

    //if(done==true){
        console.log(req.files);
        res.status(204).end();
   // } 

});



//notifications



















// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



//routes
app.post ('/login',function (req,res,next) {
    var auth = passport.authenticate('local',function (err,user) {

        if (err){return next(err)};
        if (!user) {
            res.send({success:false});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send({success:true,user:user});

        })
    })

    auth(req,res,next);
});

//authorization
var User = mongoose.model('users');
passport.use(new LocalStrategy 
    (
         function (username , password , done) {

            User.findOne ({userName:username}).
            exec(function (err , user){
                if (user && user.password == password) 
                {
                    return done(null,user);
                }
                else
                {
                    return done(null,false);
                }
            })
        }
    )
);

passport.serializeUser (function (user , done) {
    if (user) {
        done(null,user._id);
    }
});

passport.deserializeUser (function (id , done) {
    User.findOne ({_id:id}).exec(function (err, user) {
        if (user) {
            return done(null,user);
        }
        else
        {
            return done(null,false);
        }
    });
});


module.exports = app;



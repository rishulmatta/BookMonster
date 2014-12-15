var express = require('express');
var router = express.Router();
var passport = require ('passport');
var path = require('path');
var mongoose = require('mongoose');

var  fileSystem = require('fs'); 


var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";
var config = require('../config.js')[env];


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
  
});


router.get('/book/:bookName',function (req , res ) {

    
    console.log('Inside book reading block : ' + req.params.bookName);
    req.params.bookName += '.html';

    var filePath = path.join(__dirname,'/../\\public\\books\\' ,req.params.bookName );
    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        //'Content-Type': 'application/zip',
       // 'Content-Type': 'blob', -- working
        //'Content-Type': 'application/octet-stream',
        'Content-Type':'text/html',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);

   
});

var annotations = mongoose.model('TrnAnnotations');
router.get('/book/:bookName/annotations',function (req , res ) { 

    console.log('Inside Annotations extraction : ' + req.params.bookName);
    annotations.find({sBook:req.params.bookName}, function (err, annotationCollection) {

        if (err)
        {
             return res.send(err);
        }
        else 
        {
            return res.json(annotationCollection);
        }
    });

});

router.post('/book/:bookName/annotations',function (req , res ) { 

    console.log('Inside Annotations insertion : ' + req.params.bookName);
    var newDoc = new annotations(req.body.data);

    newDoc.save(function (err,data) {
        if (err)
        {
            console.log("Insertion Failed");
            return res.send(err);
        }
        else {
            console.log("Inserted");
            console.log(data);
            return res.send(data);
        }
    });

   

});

router.put('/book/:bookName/annotations',function (req , res ) { 

    console.log('Inside Annotations update : ' + req.params.bookName);
    var newDoc = new annotations(req.body.data);
    var updateData = {

        aQuestions:req.body.data.aQuestions,
        aNotes:req.body.data.aNotes
    }

    annotations.update({_id: req.body.data._id},updateData,{ upsert: true },function (err,data) {
        if (err)
        {
            console.log("Update Failed");
            return res.send(err);
        }
        else {
            console.log("Updated");
            console.log(data);
            return res.end();
        }
    });

   

});





router.get('/partials/:partialPath' , function (req , res ) {

    res.render ('partials/' + req.params.partialPath);
    console.log('Inside template block' + req.params.partialPath);
    
});


router.get('/library' , function (req , res ) {

    fileSystem.readdir('../public/books/', function (err, files) {
      if (err)
        {
             return res.send(err);
        }
        else 
        {
            return res.json(files);
        }

    })
    
});








module.exports = router;

var mongoose = require('mongoose');

module.exports = function (config) {
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error' , function () {
	    console.log("MongoDb connecting error");
	});

	db.once('open' , function () {
	    console.log("mongodb connected");
	})
	


	var userSchema = mongoose.Schema ({
		firstName:String,
		lastName:String,
		userName:String,
		password:String,
		role:String
	});

	var User = mongoose.model ('users',userSchema);
	User.find({}).exec(function (err, collection) {
		if (collection.length === 0) {

			User.create({
				firstName:"student",
				lastName:"student",
				userName:"student",
				password:"student",
				role:"student"
			})

			User.create({
				firstName:"teacher",
				lastName:"teacher",
				userName:"teacher",
				password:"teacher",
				role:"teacher"
			})

			User.create({
				firstName:"poornesh",
				lastName:"poornesh",
				userName:"poornesh",
				password:"poornesh",
				role:"teacher"
			})

			User.create({
				firstName:"ashwin",
				lastName:"ashwin",
				userName:"ashwin",
				password:"ashwin",
				role:"teacher"
			})

			User.create({
				firstName:"rishul",
				lastName:"rishul",
				userName:"rishul",
				password:"rishul",
				role:"student"
			})

		}

	})

	var annotationSchema = mongoose.Schema({

		sBook:String,
		nStartOffset:Number,
		nEndOffset:Number,
		sStartParentClass:String,
		sEndParentClass:String,
		sText:String,		
		nPageNo:Number,
		aQuestions:[{ sText:String , dDate:Date , sUser:String , nVotes:Number ,aAnswers:[{sText:String , dDate:Date ,sUser:String, nVotes:Number}] }],
		aNotes:[{sText:String , dDate:Date ,sUser:String}]
	});

	var annotation = mongoose.model ('TrnAnnotations',annotationSchema);
	annotation.find({})
		.exec(function (err , collection) { 
				if (collection.length === 0)
				 {

					annotation.create({
						
						sBook:"OData",
						nStartOffset:2,
						nEndOffset:10,
						sStartParentClass:"t m0 x5 h2 y21 ff4 fs0 fc0 sc0 ls0 ws0",
						sEndParentClass:"t m0 x5 h2 y21 ff4 fs0 fc0 sc0 ls0 ws0",
						sText:"covered by trademarks or similar intellectual property rights. This notice does not grant any",						
						nPageNo:1,
						aQuestions:[{ sText:"What is the author trying to say?" , dDate:new Date().toISOString() , sUser:"teacher" , nVotes:"3",aAnswers:[{sText:"Gosh it is difficult" , dDate:new Date().toISOString() ,sUser:"student1" , nVotes:"6"}] }],
						aNotes:[{sText:"Pay attention to these lines" , dDate: new Date().toISOString() ,sUser:"teacher"}]
					}, function (error) {

						console.log (error);
					})

					annotation.create({
						
						sBook:"OData",
						nStartOffset:2,
						nEndOffset:10,
						sStartParentClass:"t m0 x3 h2 y2c ff4 fs0 fc0 sc0 ls0 ws0",
						sEndParentClass:"t m0 x3 h2 y2c ff4 fs0 fc0 sc0 ls0 ws0",
						sText:"Open Specifications are intended for use in conjunction with publicly available standard",						
						nPageNo:1,
						aQuestions:[{ sText:"Do you know what are repercussions of this?" , dDate:new Date().toISOString() , sUser:"teacher",nVotes:"-1" ,aAnswers:[{sText:"I think..." , dDate:new Date().toISOString() ,sUser:"student1" , nVotes:"-1"}] }],
						aNotes:[{sText:"Gosh in last exam this line fetched me 5 marks lol :)" , dDate: new Date().toISOString() ,sUser:"teacher"}]
					})
				}
			});
}
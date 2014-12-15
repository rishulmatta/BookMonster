var mongoose = require ("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({

	name: String
});


mongoose.model ('users',userSchema);
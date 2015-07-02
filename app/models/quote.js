//grap the packages we need
var mongoose   		= require('mongoose');
var Schema			= mongoose.Schema;
var bcrypt			= require('bcrypt-nodejs');

//quote schema
var QuoteSchema = new Schema({
	words: String,
	book:  String,
	tags:  Array
});

// return the model
module.exports = mongoose.model('Quote', QuoteSchema);
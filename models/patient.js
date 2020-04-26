var mongoose = require("mongoose");
var PatientSchema = new mongoose.Schema({
	name: String,
	age: Number,
	sex: String,
	Blood_group: String,
	Disease: String,
	requirement: Number
}) 
module.exports= mongoose.model("patient",PatientSchema);
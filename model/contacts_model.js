var mongoose = require('mongoose');
var CONTACTS = mongoose.model('cl_contacts', {
  username:String, 
  contact: String,
  email: String
});

exports.fetchContact = function(obj,callback){
	CONTACTS.find(obj,function(err,res){
		if(err) return callback(err);
		callback(null,res);
	});
}

exports.saveContact = function(obj,callback){
	var contacts = new CONTACTS(obj);
	contacts.save(function(err,res){
		if(err) return callback(err);
		callback(null,res);
	});
}

exports.updateContact = function(id, obj, callback){
	CONTACTS.findByIdAndUpdate(id, { $set: obj }, {}, function(err, res){
		if(err) return callback(err);
		callback(null,res);	
	});
}

exports.deleteContact = function(id,callback){
	CONTACTS.findByIdAndRemove(id,function(err,res){
		if(err) return callback(err);
		callback(null,res);
	});
}



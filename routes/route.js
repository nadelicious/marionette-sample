var  contacts = require('../model/contacts_model.js');

exports.corsSettings = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
	// deal with OPTIONS method during a preflight request
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
}

exports.getContacts = function(req,res){
	contacts.fetchContact({},function(err,docs){
		if(err){
			res.statusCode= 404;
			throw err;
		}
		 res.send(docs);
	});
}

exports.addContact = function(req,res){
	var obj ={
	 username: req.body.username,
	 contact:req.body.contact,
	 email:req.body.email
	};
	contacts.saveContact(obj,function(err,docs){
		if(err){
			res.statusCode= 404;
			throw err;
		}
		res.send(200, docs);
	});
}


exports.updateContact = function(req,res){
	var id = req.params.id;
	var obj = {
		username: req.body.username,
		contact: req.body.contact,
		email: req.body.email
	};
	contacts.updateContact(id,obj,function(err,docs){
		if(err){
			res.statusCode= 404;
			throw err;
		}
		res.send(200, docs);
	});
}

exports.deleteContact = function(req,res){
	var id = req.params.id;
	contacts.deleteContact(id,function(err,docs){
		if(err){
			res.statusCode= 404;
			throw err;
		}
		res.send(200, docs);
	});
}

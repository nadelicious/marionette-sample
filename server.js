var express = require('express');
var mongoose = require('mongoose');
var route =require('./routes/route.js');
var app =express();

mongoose.connect('localhost', 'db_contacts');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

app.configure(function(){
	app.locals.pretty = true;
	app.use(express.bodyParser());
	app.use(route.corsSettings);
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.get('/contacts',route.getContacts);
app.post('/contacts',route.addContact);
app.put('/contacts/:id',route.updateContact);
app.delete('/contacts/:id',route.deleteContact);

app.listen(process.env.PORT || 3000);
console.log('Application is running at localhost:3000');
(function ($, Backbone, Marionette, _) {
	var contactModel = Backbone.Model.extend({
		validate: function(attrs) {
			if (!attrs.username ){
				return 'Username is required';
			}
			if(!attrs.contact){
				return 'Please enter a valid number';
			}
			if (!attrs.email ){
				return 'Please enter a valid email address.';
			}
		},
		idAttribute : "_id",
		urlRoot: "/contacts",
		defaults : {
			_id: null,
			username: '',
			contact: '',
			email: ''
		}
	});
	
	var contactCollection =  Backbone.Collection.extend({
		model: contactModel,
		url: '/contacts'
	});
	
	var contactItemView = Backbone.Marionette.ItemView.extend({
		initialize: function(){
			this.listenTo(this.model, 'change',this.render);
			this.listenTo(this.model.collection, 'remove',this.render);
		},
		template:'#contactsTemplate',
		tagName:'tr',
		events:{
			'click a.delete': 'deleteContact',
			'click a.edit'  : 'editContact',
			'click a.update' : 'updateContact',
			'click a.cancel' : 'cancelEdit'
		},
		editContact: function(ev) {
			var el = $(ev.currentTarget);
			var el_show =el.siblings('.update , .cancel');
			var el_hide = el.siblings('.delete');
			var inputs = el.parents('tr').find('input');
			el.hide();
			el_hide.hide();
			el_show.show();
			inputs.attr('disabled',false);
		},
		updateContact: function(ev){
			var el = $(ev.currentTarget);
			var username = el.parents('tr').find('input[name=username]');
			var contact = el.parents('tr').find('input[name=contact]');
			var email = el.parents('tr').find('input[name=email]');
			this.model.save({
				username: $.trim(username.val()),
				contact: $.trim(contact.val()),
				email: $.trim(email.val())
			},{
				wait:true,
				success: function (model, resp, opt) {
					console.log('model:update success: ', model);
				},
				error: function (model, xhr, opt) {
					console.log('model:update error: ', model);
				}
			});
		},
		cancelEdit: function(ev){
			var el = $(ev.currentTarget);
			var el_show =el.siblings('.edit , .delete');
			var el_hide = el.siblings('.update');
			var inputs = el.parents('tr').find('input');
			el.hide();
			el_hide.hide();
			el_show.show();
			inputs.attr('disabled',true);
		},
		deleteContact: function() {
			this.model.destroy({
				wait:true,
				success: function (model, resp, opt) {
					console.log('model:delete success: ', model);
				},
				error: function (model, xhr, opt) {
					console.log('model:delete error: ', model);
				}
			});
		},
		
		onBeforeRender: function () {
			this.model.set('position', this.model.collection.indexOf(this.model) + 1);
		}
	});
	
	var emptyContactView = Marionette.ItemView.extend({
		tagName: 'tr',
		template: '#contactsEmptyTemplate'
	});
	
	var contactMainView = Marionette.CompositeView.extend({
		el: 'div#main-contacts-container',
		itemView: contactItemView,
		emptyView: emptyContactView,
		itemViewContainer: 'table#contacts-container > tbody',
		initialize:function(){
			this.isRendered = true;
			this.bindUIElements();
			this.listenTo(this.collection, 'add remove', this.updateContactCounter)
			this.collection.fetch();
		},
		ui:{
			'count': 'span.count',
			'username':'#add-contacts-container td input[name=username]',
			'contact': '#add-contacts-container td input[name=contact]',
			'email': '#add-contacts-container td input[name=email]'
		},
		events: {
			'click .add': 'addContact'
		},
		addContact: function(e) {
			var _this =this;
			e.preventDefault();
			this.collection.create({
				username: this.ui.username.val(),
				contact: this.ui.contact.val(),
				email: this.ui.email.val(),
			},{ 
				wait: true, 
				success: function (model, resp, opt){
					_this.collection.add(model);
					_this.clearForm();
					console.log('model:create done: ', model);
				},
				error: function (model, xhr, opt){
					console.log('model:create error: ', model);
				}
			});
		},
		clearForm: function() {
			this.ui.username.val('');
			this.ui.contact.val('');
			this.ui.email.val('');
		},
		updateContactCounter: function () {
			this.ui.count.text(this.collection.length);
		}	
	});


	var appRouter = Backbone.Marionette.AppRouter.extend({
	  routes : {
		'' : 'index'
	  },
	});

	new appRouter;
	Backbone.history.start();
	var contactApp = new contactMainView({ collection: new contactCollection()});
	window.app = contactApp;

})(jQuery, Backbone, Marionette, _)

$(function(){
    new Backbone.Marionette.Application();
	app.start();
});



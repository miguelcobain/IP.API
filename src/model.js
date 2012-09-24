define(['sync','require'],function(Sync, require) {
	
	var SELF_REL = 'self';
	var LINK_FIELD = 'links';
	
	var Model = function(attrs){
		
		//Model's attributes
		this.attrs = {};
		
		//Model's getters indexed by property
		this._getters = {};
		
		//Set contructor's attributes
		this.set(attrs);
	};
	
	//Composite Get ('shopping list' pattern)
	Model.prototype.get = function(attrs, callback){
		
		//Parameters to provide callback
		var params = [];
		//Semaphore
		var semaphore = attrs.length;
		
		var callGetter = function(self, attrs, i, params, callback){
			if(self._getters.hasOwnProperty(attrs[i])){
				//Yes, I have the getter for the property you want
				self._getters[attrs[i]](function(value){
					params[i] = value;
					callback.call(self);
				});
			}
			else
				//No, I don't have that getter. Let's move on.
				callback.call(self);
		};
		
		// call all getters simultaneously
		for(var i=0; i<attrs.length; i++){
			callGetter(this, attrs, i, params, function(){
				semaphore--;
				if(semaphore===0)
					//I'm the last completed getter so I'm calling the callback with all the parameters
					callback.apply(this, params);
			});
		}
	};
	
	Model.prototype.set = function(attrs){
		// helper function to bind getters and setters for in memory attributes
		var bindGetterSetter = function(obj, p, properties) {
			obj[('get ' + p).camelize()] = obj._getters[p] = function(callback) {
				callback(properties[p]);
			}
			obj[('set ' + p).camelize()] = function(val) {
				properties[p] = val;
				return this;
			}
		};		
		// helper function to bind getters for remote attributes
		var bindGetterSetterRel = function(obj, p, link) {
			obj[('get ' + p).camelize()] = obj._getters[p] = function(data, callback) {
				
				if(!callback){
					callback = data;
					data = {};
				}
				
				var success = function(data){
					if(data && data.items && data.items instanceof Array){
						//Collection
						var Collection = require('collection');
						var attr = {};
						attr[p] = new Collection({url:link.href});
						attr[p].add(data.items);
						obj.set(attr);
					}
					else{
						//Model
						var attr = {};
						attr[p] = new Model(data);
						obj.set(attr);
					}
					
					if(callback)
						callback(obj.attrs[p]);
				}
				
				return Sync.call(this, 'read', null, {success:success,url:link.href,data:data});
			}
		};
		//Bind Getters and Setters
		for (var p in attrs){
			if(p!==LINK_FIELD){
				//check if it is an embbeded resource or just a common property
				if(attrs[p] && attrs[p].hasOwnProperty(LINK_FIELD)){
					//if it has a links field, then it is an embbed resource
					this.attrs[p] = new Model(attrs[p]);
					bindGetterSetter(this, p, this.attrs);
				}
				else{
					this.attrs[p] = attrs[p];
					bindGetterSetter(this, p, this.attrs);
				}
			}
			else{
				var links = attrs[p];
				for(var i=0; i<links.length; i++){
					if(links[i].rel === SELF_REL){
						//Use link provided by the API
						//Don't bind getter for this link
						this.url = links[i].href;
					}
					else
						bindGetterSetterRel(this, links[i].rel, links[i])
				}
			}
		}
	};
	
	//Default validate function
	Model.prototype.validate = function(){
		//Check if it has an id property
		return this.attrs.hasOwnProperty('id');
	}
	
	Model.prototype.url = function() {
		var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
		return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.attrs.id);
	};
	
	Model.prototype.update = function(callback){
		var model = this;
		var success = callback;
		callback = function(resp, status, xhr) {
			model.set(resp);
			if (success) success(model, resp);
		};
		return Sync.call(this, 'read', this, {success:callback});
	};
	
	var getValue = function(object, prop) {
		if (!(object && object[prop])) return null;
		return typeof(object[prop])=='function' ? object[prop]() : object[prop];
	};
	
	var urlError = function() {
		throw new Error('A "url" property or function must be specified');
	};
	
	return Model;
	
});

define(['model','sync'],function(Model, Sync) {
	
	var Collection = function(options){
		//Initialization
		this.length = 0;
		this.models = [];
		this._byId  = {};
		
		this.url = options.url;
	}
	
	Collection.prototype.getAll = function(callback) {
		var collection = this;
		var success = callback;
		callback = function(resp, status, xhr) {
			if(status == 'success')
				collection.add(resp.items);
			if (success) success(collection, resp);
		};
		return Sync.call(this, 'read', this, {success:callback});
	};
	
	Collection.prototype.get = function(id, callback){
		//do nothing if id is null
		if (id == null) return void 0;
		
		//return and execute callback imediatly if the model is in memory
		var el = this._byId[id.id != null ? id.id : id];
		if(el){
			callback(el)
			return el;
		}
		//if it isn't, let's retrieve it from server
		else {
			var collection = this;
			var model = new Model({id:id});
			model.collection = this;
			model.update(function(model){
				collection.add(model);
				if(callback) callback(model);
			});
		}
	};
	
	Collection.prototype.add = function(models) {
		
		//Handle multiple and single model cases
		models = models instanceof Array ? models : [models];
		
		for(var i=0; i<models.length; i++){
			//Transform objects into models
			if (!(models[i] instanceof Model)) {
				var attrs = models[i];
				models[i] = new Model(attrs);
				models[i].collection = this;
			}
			
			if(!models[i].validate())
				throw new Error("Can't add an invalid model to a collection");
			
			//Add the model and update length
			this._byId[models[i].attrs.id] = models[i];
			this.models.push(models[i]);
			this.length++;	
		}
	};
	
	Collection.prototype.forEach = function(func){
		for(var i=0; i<this.models.length; i++){
			func.apply(this,[this.models[i],i]);
		}
	}
	
	return Collection;
	
});

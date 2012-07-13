define(['model','sync'],function(Model, Sync) {
	
	var Collection = function(options){
		//Initialization
		this.length = 0;
		this.models = [];
		this._byId  = {};
		
		this.url = options.url;
	}
	
	Collection.prototype.getAll = function(options) {
		options = options ? options : {};
		var collection = this;
		var success = options.success;
		options.success = function(resp, status, xhr) {
			if(status == 'success')
				collection.add(resp.items);
			if (success) success(collection, resp);
		};
		return Sync.call(this, 'read', this, options);
	};
	
	Collection.prototype.get = function(id){
		if (id == null) return void 0;
		return this._byId[id.id != null ? id.id : id];
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
	
	return Collection;
	
});

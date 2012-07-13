/**
 * Creates namespaces based on a string and returns it
 * 
 * @param {Object} namespaceString string that represents the namespace to create
 * @see http://elegantcode.com/2011/01/26/basic-javascript-part-8-namespaces/
 */

function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    return parent;
}

String.prototype.camelize = function() {
    return this
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

require.config({
	paths : {
		jquery : '../lib/jquery.min'
	}
});

require(['collection', 'model'], function(Collection, Model) {

	//Declare namespace    
    var model = namespace('IP.API');
    
    /*
     * Entry points:
     * 		/places
     * 		/places/{id}
     * 		/activity
     */

	//Add classes to namespace
	model.Model = Model;
	model.Collection = Collection;
	
	//Base API URL
	var API_URL = 'http://api.instantplaces.org/';
	
	//Instantiate Entry Points
	model.Places = new Collection({ url: API_URL+'places' });
	model.Activity = new Collection({ url: API_URL+'activity' });
	model.Applications = new Collection({ url: API_URL+'applications' });
	model.Identities = new Collection({ url: API_URL+'identities' });
	model.Signs = new Collection({ url: API_URL+'publish/signs' });
	model.Items = new Collection({ url: API_URL+'publish/items' });
	model.CollectionItems = new Collection({ url: API_URL+'publish/collections' });
	model.Publishers = new Collection({ url: API_URL+'publish/publishers' });

});
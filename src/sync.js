define(['jquery','iexhr'], function($,IEXMLHttpRequest){
	
	// Needed to force jquery to allow cross domain calls (in IE)
	$.support.cors = true;
		
	//CRUD to HTTP dictionary
	var methodMap = {
		'create' : 'POST',
		'update' : 'PUT',
		'delete' : 'DELETE',
		'read'   : 'GET'
	};
	
	var Sync = function(method, model, options){
		//Map CRUD methods to HTTP
		var type = methodMap[method];
		
		if (!options.url) {
			options.url = getValue(model, 'url') || urlError();
		}
		
		$.ajax({
			url: options.url,
			type: type,
			dataType: 'json',
			xhr : IEXMLHttpRequest || $.ajaxSettings.xhr,
      		crossDomain: true,
			success: options.success
		});
	};
	
	var getValue = function(object, prop) {
		if (!(object && object[prop])) return null;
		return typeof(object[prop])=='function' ? object[prop]() : object[prop];
	};
	
	var urlError = function() {
		throw new Error('A "url" property or function must be specified');
	};

	return Sync;

});

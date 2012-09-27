# Instant Places API Client #

Instant Places API Client (or IP.API) is a javascript library that abstracts the usage of the Instant Places REST API. It was designed to be used with any javascript based applications, such as [Instant Places](http://www.instantplaces.org/) applications. Some of its concepts were kindly borrowed from [BackboneJS](http://backbonejs.org/).

# Getting Started #

The usage is very simple. 

1. Download the built javascript file from the `build/` directory.
2. Include it in your HTML page (or whatever javascript dependency manager you're using).
3. The `IP.API` namespace is created for you, and you can start using it. See examples below.

Basic usage:

	//Let's fetch some Places
    IP.API.Places.getAll(function(collection){

		//collection and IP.API.Places are the same collection

        //Print the retrieved models (Places)
        console.log(collection.models);
        //Print length
        console.log(collection.length);

		//What about Place #1?
		collection.get(1,function(model){
			//Print Place with id 1
			console.log(model);
		});

    });

# Component Overview #

## Model ##

`Model` is a core component of the library. It is a generic representation of a resource in Instant Places. You can think of it as a *wrapper* of javascript objects to extend their functionality. A Model can have **local attributes** like any regular javascript object, but can also have attributes that can be retrieved through additional API calls, which we call **remote attributes**. This phenomenon is frequent in relationships between resources. For example, a **Place** (resource) representation has links to retrieve its **Activities** (sub-resource). `Model` abstracts this particularities and allows you to treat every attribute equally.

### API ###

- **[dynamic getters]** `model.getProperty([data], callback)`

When a Model is created, it binds getters and setters to itself for each attribute it has. Because attributes might be remote (i.e. not currently in memory), you must provide a callback. Your callback will be executed with the corresponding attribute as an argument.

The goal is to abstract the access to attributes, providing a consistent API to them. The developer shouldn't care about wether the attribute is in memory or not. Also, this allows the API and the library to be loosely coupled, e.g. if the API decides to turn a previouly sent attribute into something remote (a sub-resource), the library still works as expected.

Once the remote attribute is fetched it is set as a local attribute. Further accesses are faster since they can be fetched from memory.

You can optionally provide a `data` object to parameterize the request.

----------

- **[dynamic setters]** `model.setProperty(value, [callback])`

*NOT FULLY IMPLEMENTED YET*

Currently, `Model` only binds setters for local properties, which isn't problematic since the Instant Places API is mostly readonly.

----------

- **get** `model.get(attributes,callback)`

Using asynchronous getters to get multiple attributes might become cumbersome. `model.get` is a composite getter that tries to ease the task of fetching attributes.

With the normal asynchronous getters, you would have to do:

	model.getA(function(a){
		model.getB(function(b){
			model.getC(function(c){
				//use variables a, b and c
			});
		});
	});

With composite getter you can do things like these, regardless if the attributes are remote or not:

    model.get(
		['a','b','c'],
		function(a,b,c){
			//use variables a, b and c
		}
	);

Besides obvious advantages in code readability, the second version can also have performance improvements. Suppose that attributes `b` and `c` are remote. The first version fires requests sequentially, i.e. the request for attribute `c` is only made when the request for attribute `b` succeeds. In the second version every request is fired **simultaneously** (by calling dynamic getters) and when all the getters succeed, the provided callback is executed.

This was inspired by *Jared Jacobs*' "shopping list pattern" illustrated in this [blog entry](http://ajaxian.com/archives/designing-a-javascript-client-for-a-rest-api).

----------

- **set** `model.set(attributes)`

This method is used to set attributes on a particular model. It takes an object containing the attributes to set and binds getters and setters to them. Since currently the Instant Places API is mostly readonly, setters don't have that much importance yet.

----------

- **update** `model.update(callback)`

Updates the model's attributes with data from Sync module.

----------

- **attrs** `model.attrs`

Every model has an `attrs` object which contains all the local attributes. If you are sure that an attribute is local you can access it like `attrs.[property name]`. Keep in mind that using getter methods is much more *future proof* because they are agnostic about if the attributes are local or remote.

## Collection ##

`Collection` represents a set of `Model` of a particular resource. You can think of it as a "wrapper" of an array of models.

### API ###

- **add** `collection.add(models)`

Adds a model (or a list of models) to the collection. It transforms barebone javascript objects to models.

----------

- **get** `collection.get(id, callback)`

Returns the model which has the specified id regardless if it is already in memory or on the server.

----------

- **getAll** `collection.getAll([data], callback)`

Retrieves all the items from a particular collection and calls the `add` method on each of them.

You can optionally provide a `data` object to parameterize the request.

----------

- **forEach** `collection.forEach(function)`

Allows you to iterate the collection. For each item, `function` is called with the item and its corresponding index as arguments.

## Synchronization Module ##

Models and Collections are only aware of [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations. The task of synchronizing data to another location is up to a **Sync Module** to do. This library is bundled with a module that maps CRUD to HTTP requests and communicates with the Instant Places API. This module depends on [jQuery](http://jquery.com/) to make the AJAX requests. Our API and this library support [CORS](http://www.w3.org/TR/cors/) for crossdomain requests to be possible (IE9 included).

Although this is a very important component of the library you probably won't directly interact with it. In a nutshell, this module is responsible for transforming higher level CRUD operations into some other lower level protocol operations (HTTP, localStorage, etc).

## Predefined Collections ##

IP.API registers some default Collections that map directly to Instant Places Models which are:

- IP.API.Places
- IP.API.Activity
- IP.API.Applications
- IP.API.Identities
- IP.API.Signs
- IP.API.Items
- IP.API.CollectionItems
- IP.API.Publishers

All of these are normal instances of `Collection` and you can start using them. For example, you can quickly retrieve all the places writing `IP.API.Places.getAll(yourCallback)`.

These correspond to the Instant Places API's entry points. In the future, these entry points will also be retrieved dynamically and will not hardcoded.



# Downloading or Building IP.API #

IP.API was developed using [RequireJS](http://requirejs.org/) and consequently using a modular technique called [AMD](http://requirejs.org/docs/whyamd.html). You can just download the built file (minified or not). If you prefer you can build the library using [r.js](http://requirejs.org/docs/optimization.html). The build files are already included in the repository (one for the minified version and another for the debug non-minified version).

After you [install r.js](http://requirejs.org/docs/optimization.html#download), you can run the following command:

    $ r.js -o <buildfile>

The built javascript file should appear in the `build/` directory.

# Future Work #

- Event bindings to Collections and Models
    - Change
    - Add
    - Remove
- Error handling
- Better semantic support for links (only GET's for now)
- Investigate possible optimizations using localStorage
- Maybe get rid of the jQuery dependency
- Authentication?
- templated links
- **Extension Points**

    - The ultimate goal of this library is to allow you to interact with any REST API. To do so, some assumptions were made, but we intend to make them overridable because your API may have its own particularities. Some of these extension points are:

        - Link parsing
        - Id parsing
        - Decision of wether we've requested a Collection or a Model
        - Mapping of link rel's to CRUD operations (in order to properly use the Sync module)
        - More to come...

Ideally, this library should be generic and not tied to Instant Places but to HATEOAS-enabled REST API's in general. It's still in an embrionary state, but this is the ultimate goal. :)
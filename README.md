# Instant Places API Client #

Instant Places API Client is a javascript library that abstracts the usage of the Instant Places REST API. It was designed to be used with any javascript based applications, such as [Instant Places](http://www.instantplaces.org/) applications.

## Getting Started ##

The usage is very simple. 

1. Download the built javascript file.
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
		console.log(collection.get(1,function(model){
			//Print Place with id 1
			console.log(model);
		}));

    });

# Component Overview #

## Model ##

`Model` is a core component of the library. It is a generic representation of a resource in Instant Places. You can think of it as a *wrapper* to javascript objects to extend their functionality. A Model can have **local attributes** like any regular javascript object, but can also have attributes that can be retrieved through additional API calls, which we call **remote attributes**. This phenomenon is frequent in relationships between sub-resources and resource. For example, a **Place** (resource) representation has links to retrieve its **Activities** (sub-resource). `Model` abstracts this particularities and allows you to treat every attribute equally.

### API ###

- **[dynamic getters]** `model.getProperty(callback)`

When a Model is created, it binds getters and setters to itself for each attribute it has. Because attributes might be remote (i.e. not currently in memory), you must provide a callback. Your callback will be executed with the corresponding attribute as an argument.

The goal is to abstract the access to attributes, providing a consistent API. The developer shouldn't care about wether the attribute is in memory or not. Also, this allows the API and the library to be loosely coupled, e.g. if the API decides to turn a previouly sent attribute into something remote (a sub-resource), the library still works as expected.

----------

- **[dynamic setters]** `model.setProperty(value, [callback])`

*NOT FULLY IMPLEMENTED YET*

Currently, `Model` only binds setters for local properties.

----------

- **get** `model.get(attributes,callback)`

Using assynchronous getters to get multiple attributes might become cumbersome. `model.get` is a composite getter that tries to easy the task of fetching attributes.

With normal getters, you would have to do:

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

## Collection ##

`Collection` represents a set of `Model` of a particular resource.

### API ###

- **getAll** `collection.getAll(callback)`

When a Model is created, it binds getters and setters to itself for each attribute it has. Because attributes might be remote (i.e. not currently in memory), you must provide a callback. Your callback will be executed with the corresponding attribute as an argument.

## Synchronization Module ##

## Predefined Collections ##

# Downloading or Building IP.API #

Build:

    $ r.js -o <buildfile>

## Future Work ##

- Event bindings to Collections and Models
    - Change
    - Add
    - Remove
- Errors
- Better semantic support for links (only GET's for now)
- Investigate possible optimizations using localStorage

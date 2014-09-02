json-easy-filter
================

Javascript node module for convenient json filtering and programatic querying.

For other similar projects see [Links](#Links) section.

**Important.** This software is still in early development stage. 

## Installation
```shell
$ npm install json-easy-filter
```

## Usage
```js
var jef = require('json-easy-filter');

var obj = {
		v1: 100,
		v2: 200,
		v3: {
				v4: 300,
				v5: 400
		}
};
var numbers = new jef(obj).filter(function(node) {
		if (typeof node.value==='number') {
			return node.key + ' ' + node.value;
		}
	});

console.log(numbers);
>> [ 'v1 100', 'v2 200', 'v4 300', 'v5 400' ]
```
`filter(callback)` method will recursively traverse each node in `obj` and trigger the callback method.

The `node` parameter received by callback is a wrapper around the real Js object. Get this object by using `node.key` and `node.value`.
Check out the [API](#API) for more info.


## Examples
Use this <a href="https://raw.githubusercontent.com/gliviu/json-easy-filter/master/tests/sampleData1.js" target="_blank">sample</a> data to follow the examples.


&#35;1. node.has()

```js
var res = new Jef(sample1).filter(function(node) {
	if (node.has('username')) {
		return node.value.username;
	}
});
console.log(res);

>> [ 'john', 'adams', 'lee', 'scott', null ] 
```
&#35;2. node.value
```js
var res = new Jef(sample1).filter(function(node) {
	if (node.has('salary') && node.value.salary > 200) {
		return node.value.username + ' ' + node.value.salary;
	}
});
console.log(res);
>> [ 'lee 300', 'scott 400' ] 
```

&#35;3. Paths, node.has(RegExp)
```js
var res = new Jef(sample1).filter(function(node){
	if(node.has(/^(phone|email|city)$/)){
		return node.path;
	}
});
console.log(res);
>> 
[ 'employees.0.contact.0',
  'employees.0.contact.1',
  'employees.0.contact.2.address' ]
```
When `has(propertyName)` receives a string it calls `node.value[propertyName]`. If RegExp is used, all properties of `node.value` are iterated and tested against it.

&#35;4. node.key, node.parent and node.get()
```js
var res = new Jef(sample1).filter(function(node){
	if(node.key==='email' && node.value==='a@b.c'){
		var res = [];
		res.push('Email: key - '+node.key+', value: '+node.value+', path: '+node.path);

		if(node.parent){ // Test parent exists
			var emailContainer = node.parent;
			res.push('Email parent: key - '+emailContainer.key+', type: '+emailContainer.getType()+', path: '+emailContainer.path);
		}

		if(node.parent && node.parent.parent){
			var contact = node.parent.parent;
			res.push('Contact: key - '+contact.key+', type: '+contact.getType()+', path: '+contact.path);

			var city = contact.get('2.address.city');
			if(city){ // Test relative path exists. node.get() returns 'undefined' otherwise.
				res.push('City: key - '+city.key+', type: '+city.value+', path: '+city.path);
			}
		}

		return res;
	}
});
console.log(res);
>>
[ [ 'Email: key - email, value: a@b.c, path: employees.0.contact.1.email',
    'Email parent: key - 1, type: object, path: employees.0.contact.1',
    'Contact: key - contact, type: array, path: employees.0.contact',
    'City: key - city, type: NY, path: employees.0.contact.2.address.city' ] ]
```

&#35;5. Array handling
```js
var res = new Jef(sample1).filter(function(node){
	if(node.parent && node.parent.key==='employees'){
		if(node.getType()==='object'){
			return 'key: '+node.key+', username: '+node.value.username+', path: '+node.path;
		} else{
			return 'key: '+node.key+', username: '+node.value+', path: '+node.path;
		}
	}
});
console.log(res);
>>
[ 'key: 0, username: john, path: departments.admin.employees.0',
  'key: 1, username: lee, path: departments.admin.employees.1',
  'key: 0, username: scott, path: departments.it.employees.0',
  'key: 1, username: john, path: departments.it.employees.1',
  'key: 2, username: lewis, path: departments.it.employees.2',
  'key: 0, username: adams, path: departments.finance.employees.0',
  'key: 1, username: scott, path: departments.finance.employees.1',
  'key: 2, username: lee, path: departments.finance.employees.2',
  'key: 0, username: john, path: employees.0',
  'key: 1, username: adams, path: employees.1',
  'key: 2, username: lee, path: employees.2',
  'key: 3, username: scott, path: employees.3',
  'key: 4, username: null, path: employees.4',
  'key: 5, username: undefined, path: employees.5' ]
```

<a name="API"></a>
## API
**JsonNode**
Wrapps a real Js node inside the tree that is traversed.
* `node.key` - the key of the currently traversed object.
* `node.value` - the value of the currently traversed object.
* `node.isRoot` - true if current node is the root of the object tree.
* `node.path` - string representation of `node.pathArray`.
* `node.pathArray` - string array containing the path to current node.
* `node.level` - level of the current node. Root node has level 0.
* `node.has(propertyName)` - returns true if `node.value` has that property. If a regular expression is passed, all `node.value` property names are iterated and matched against pattern. 
* `node.get(relativePath)` - returns the `JsonNode` relative to current node or 'undefined' if path cannot be found.
* `node.getType()` - returns the type of `node.value` as one of 'string', 'array', 'object', 'function', 'undefined', 'number', 'null'.

<a name="Links"></a>
## Links
* XPath like query for json - <a href="https://www.npmjs.org/package/JSONPath" target="_blank">JsonPath</a>, <a href="https://www.npmjs.org/package/spahql" target="_blank">SpahQL</a>
*  Filter, map, reduce - <a href="https://www.npmjs.org/package/traverse" target="_blank">traverse</a>
* Json validator - <a href="https://www.npmjs.org/package/json-filter" target="_blank">json-filter</a>
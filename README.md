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
var numbers = jef(obj).filter(function(node) {
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


&#35;1. Display all usernames

```js
var res = jef(sample1).filter(function(node) {
	if (node.hasOwnProperty('username')) {
		return node.value.username;
	}
});
console.log(res);

>> [ 'john', 'adams', 'lee', 'scott', null ] 
```
&#35;2. Employee with salary over a certain value
```js
var res = jef(sample1).filter(function(node) {
	if (node.has('salary') && node.value.salary > 200) {
		return node.value.username + ' ' + node.value.salary;
	}
});
console.log(res);

>> [ 'lee 300', 'scott 400' ] 
```

<a name="API"></a>
## API
**JsonNode**
Wrapps a real Js node inside the tree that is traversed.
* `node.key` - the key of the currently traversed object.
* `node.value` - the value of the currently traversed object.
* `node.isRoot` - true if current node is the root of the object tree.
* `node.path` - string array containing the path to current node.
* `node.level` - level of the current node. Root node has level 0.
* `node.getPathStr(delimiter)` - returns the string representation of `node.path`.
* `node.get(relativePath)` - returns the `JsonNode` relative to the current node.

<a name="Links"></a>
## Links
* XPath like query for json - <a href="https://www.npmjs.org/package/JSONPath" target="_blank">JsonPath</a>, <a href="https://www.npmjs.org/package/spahql" target="_blank">SpahQL</a>
*  Filter, map, reduce - <a href="https://www.npmjs.org/package/traverse" target="_blank">traverse</a>
* Json validator - <a href="https://www.npmjs.org/package/json-filter" target="_blank">json-filter</a>
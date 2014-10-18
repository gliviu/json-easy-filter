json-easy-filter
================
Javascript node module for programmatic filtering and validation of Json objects.

## Installation
```shell
$ npm install json-easy-filter
```

## Usage
[plunkr](http://plnkr.co/edit/yZ85mr)
```js
var JefNode = require('json-easy-filter').JefNode;

var obj = {
		v1: 100,
		v2: 'v2',
		v3: {
				v4: 'v4',
				v5: 400
		}
};
var numbers = new JefNode(obj).filter(function(node) {
		if (node.type()==='number') {
			return node.key + ' ' + node.value;
		}
	});

console.log(numbers);
>> [ 'v1 100', 'v5 400' ]
```
#### How it works
Any newly instantiated JefNode object is actually a structure wrapping the real Json object  so that for each Json node there will be a corresponding JefNode. 
The purpose of this structure is to allow easy tree navigation. Each JefNode maintains properties such as 'parent' which returns the ancestor or get(path) which returns a child based on its relative path.
In fact 'new JefNode(obj)' returns the root JefNode which is further used to [filter()](#exFilter), [validate()](#exValidate) or [remove()](#exRemove).

####A word on performance
It is obvious already that json-easy-filter is designed more towards convenience rather than being performance wise. Particularly using it on server side or feeding large files may pose a problem for high request rate apps. 
If this is the case, Jef exposes its own internal [traversal](#exTraverse) mechanism or you may try one of the similar projects presented in [links](#Links) section.

#### Filter, validate, remove
Tree traversal is provided by `JefNode.filter(callback)` . It will recursively iterate each node and trigger the callback method which receives the currently traveled JefNode. Use `node.value` and `node.key` to get access to the real json object. Use `parent`, `path` and `get()` to navigate the tree. Use `isRoot`, `isLeaf`, `isCircular` for information about current node. `level` provides the traversal depth. 

Do not change Json object during filter() call. Keep a list of changes and apply it after filter has finished. For convenience, [remove()](#exRemove) will iterate the tree and delete nodes passed back by the callback.

Aside from filter and remove, there is also a [validate()](#exValidate) method. Returning false from callback will cause the whole validation to fail.

Check out the examples and [API](#API) for more info.

## Examples
Use the <a href="https://raw.githubusercontent.com/gliviu/json-easy-filter/master/tests/sampleData1.js" target="_blank">sample</a> data to follow this section.

<a name="exFilter"></a>
#### Filter
&#35;1. node.has() [plunkr](http://plnkr.co/edit/nPwRhF)

```js
var res = new JefNode(sample1).filter(function(node) {
	if (node.has('username')) {
		return node.value.username;
	}
});
console.log(res);

>> [ 'john', 'adams', 'lee', 'scott', null ] 
```
&#35;2. node.value [plunkr](http://plnkr.co/edit/x9Nq4z)
```js
var res = new JefNode(sample1).filter(function(node) {
	if (node.has('salary') && node.value.salary > 200) {
		return node.value.username + ' ' + node.value.salary;
	}
});
console.log(res);
>> [ 'lee 300', 'scott 400' ] 
```

&#35;3. Paths, node.has(RegExp), level [plunkr](http://plnkr.co/edit/1t4DJ9)
```js
var res = new JefNode(sample1).filter(function(node){
	if(node.has(/^(phone|email|city)$/)){
		return 'contact: '+node.path;
	}
	if(node.pathArray[0]==='departments' && node.pathArray[1]==='admin' && node.level===3){
		return 'department '+node.key+': '+node.value;
	}
});
console.log(res);
>> 
[ 'department name: Administrative',
  'department manager: john',
  'department employees: john,lee',
  'contact: employees.0.contact.0',
  'contact: employees.0.contact.1',
  'contact: employees.0.contact.2.address' ]
```
When `has(propertyName)` receives a string it calls `node.value[propertyName]`. If RegExp is passed, all properties of `node.value` are iterated and tested against it.

&#35;4. node.key, node.parent and node.get() [plunkr](http://plnkr.co/edit/zEusEK)
```js
var res = new JefNode(sample1).filter(function(node){
	if(node.key==='email' && node.value==='a@b.c'){
		var res = [];
		res.push('Email: key - '+node.key+', value: '+node.value+', path: '+node.path);

		if(node.parent){ // Test parent exists
			var emailContainer = node.parent;
			res.push('Email parent: key - '+emailContainer.key+', type: '+emailContainer.type()+', path: '+emailContainer.path);
		}

		if(node.parent && node.parent.parent){
			var contact = node.parent.parent;
			res.push('Contact: key - '+contact.key+', type: '+contact.type()+', path: '+contact.path);

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

&#35;5. Array handling [plunkr](http://plnkr.co/edit/lseyjv)
```js
var res = new JefNode(sample1).filter(function(node){
	if(node.parent && node.parent.key==='employees'){
		if(node.type()==='object'){
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
&#35;6. Circular references [plunkr](http://plnkr.co/edit/VdWlbg)
```js
var data = {
	x: {
		y: null  
	},
	z: null,
	t: null
};
data.z = data.x;
data.x.y = data.z;
data.t = data.z;
var res = new JefNode(data).filter(function(node) {
	if(node.isRoot){
		return 'root';
	} else if (node.isCircular) {
		return 'circular key: '+node.key + ', path: '+node.path;
	} else{
		return 'key: '+node.key + ', path: '+node.path;
	}
});
console.log(res);
>>
[   "root",
    "key: x, path: x",
    "circular key: y, path: x.y",
    "circular key: z, path: z",
    "circular key: t, path: t" ]
```

<a name="exValidate"></a>
#### Validate
&#35;1. node.validate() [plunkr](http://plnkr.co/edit/L7q3VH)
```js
var res = new JefNode(sample1).validate(function(node) {
	if (node.parent && node.parent.key==='departments' && !node.has('manager')) {
		// current department is missing the mandatory 'manager' property
		return false;
	}
});
console.log(res);
>> false
```
&#35;2. Validation info [plunkr](http://plnkr.co/edit/EVqTtV)
```js
var info = [];
var res = new JefNode(sample1).validate(function(node) {
var valid = true;
if (node.parent && node.parent.key==='departments' ) {
	// Inside department
	if(!node.has('manager')){
		valid = false;
		info.push('Error: '+node.key+' department is missing mandatory manager property');
	}
	if(!node.has('employees')){
		valid = false;
		info.push('Error: '+node.key+' department is missing mandatory employee list');
	} else if(node.get('employees').type()!=='array'){
		valid = false;
		info.push('Error: '+node.key+' department has wrong employee list type "'+node.get('employees').type()+'"');
	} else if(node.value.employees.length===0){
		info.push('Warning: '+node.key+' department has no employees');
	}
}
if (node.parent && node.parent.key==='employees' && node.type()==='object') {
	// Inside employee
	if(!node.has('username') || node.get('username').type()!=='string'){
		valid = false;
		info.push('Error: Employee '+node.path+' does not have username');
	} else if(!node.has('gender')){
		info.push('Warning: Employee '+node.value.username+' does not have gender');
	}
}

return valid;
});
console.log(res.toString());
console.log(info);
>>
false
[ 'Error: marketing department is missing mandatory manager property',
  'Warning: marketing department has no employees',
  'Error: hr department is missing mandatory manager property',
  'Error: hr department is missing mandatory employee list',
  'Error: supply department is missing mandatory manager property',
  'Error: supply department has wrong employee list type "string"',
  'Warning: Employee scott does not have gender',
  'Error: Employee employees.4 does not have username',
  'Error: Employee employees.5 does not have username' ]
```
&#35;3. Sub validator [plunkr](http://plnkr.co/edit/Z43d0e)
```js
var info = [];
var res = new JefNode(sample1).get('departments').validate(function (node, local) {
    var valid = true;
    if (local.level === 1) {
        // Inside department
        if (!node.has('manager')) {
            valid = false;
            info.push('Error: ' + local.path + '(' + node.path + ')' + ' department is missing mandatory manager property');
        }
    }
    return valid;
});
console.log(res);
console.log(info);
>>
false
[ 'Error: marketing(departments.marketing) department is missing mandatory manager property',
  'Error: hr(departments.hr) department is missing mandatory manager property',
  'Error: supply(departments.supply) department is missing mandatory manager property' ]
```


<a name="exRemove"></a>
#### Remove
Instead of using filter() for deleting certain nodes, remove() makes it easy by just requiring to return the nodes to be deleted from the callback.

[plunkr](http://plnkr.co/edit/UzVghb)
```js
var sample = JSON.parse(JSON.stringify(sample1));
var success = new JefNode(sample).remove(function(node) {
    if(node.parent && node.parent.key==='departments'){
        var isITDepartment = node.has('name') && node.value.name==='IT'; 
        if(isITDepartment){
            // remove manager and first employee from IT department.
            return [node.get('manager'), node.get('employees.0')] ;
        } else{
            // remove all but IT department
            return node;
        }
    }
    if(node.parent && node.parent.key==='employees' && node.type()==='object'){
        if(node.has('salary') && node.get('salary').type()==='number' && node.value.salary<400){
            return node;
        }
    }
});
console.log(JSON.stringify(sample, null, 4));
console.log(success);
>> 
{
    "departments": {
        "it": {
            "name": "IT",
            "employees": [
                "john",
                "lewis"
            ]
        }
    },
    "employees": [
        {
            "username": "scott",
            "firstName": "Scott",
            "lastName": "SCOTT",
            "salary": 400,
            "birthDate": "1993/11/20"
        },
        {
            "firstName": "Unknown2",
            "lastName": "Unknown2"
        }
    ]
}
true
```
<a name="exTraverse"></a>
#### Traverse
Internal Json traversal mechanism is exposed for cases where performance is an issue.
[plunkr](http://plnkr.co/edit/8DfcTh)
```js
var traverse = require('json-easy-filter').traverse;
var res = [];
traverse(sample1, function (key, val, path, parentKey, parentVal, level, isRoot, isLeaf, isCircular) {
    debugger;
    if (parentKey && parentKey === 'departments') {
        // inside department
        res.push('key: ' + key + ', val: ' + val.name + ', path: ' + path);
    }
})
console.log(res);

>> [  'key: admin, val: Administrative, path: departments,admin',
	  'key: it, val: IT, path: departments,it',
	  'key: finance, val: Financiar, path: departments,finance',
	  'key: marketing, val: Commercial, path: departments,marketing',
	  'key: hr, val: Human resources, path: departments,hr',
	  'key: supply, val: undefined, path: departments,supply' ]
 
```
### Tests
Make sure it's all working with 'npm test'. The awesome [istanbul](https://www.npmjs.org/package/istanbul) tool provides code coverage.

<a name="API"></a>
## API

**JefNode class**
* `node.key` - node's key. For root object it is undefined.
* `node.value` - the real Json value behind node.
* `node.isRoot` - true if current node is the root of the object tree.
* `node.pathArray` - string array containing the path to current node.
* `node.path` - string representation of `node.pathArray`.
* `node.root` - root `JefNode`.
* `node.level` - level of the current node. Root node has level 0.
* `node.isLeaf` - true if it is a leaf node. Primitives are considered leafs, empty objects (ie. `a: { }`) are not.
* `node.isCircular` - indicates a circular reference 
* `node.count` - number of first level child nodes. For array indicates nuber of elements. 
* `node.has(propertyName)` - returns true if `node.value` has that property. If a regular expression is passed, all `node.value` property names are iterated and matched against pattern. 
* `node.get(relativePath)` - returns the `JefNode` relative to current node or 'undefined' if path cannot be found.
* `node.type()` - returns the type of `node.value` as one of 'string', 'array', 'object', 'function', 'number', 'boolean', 'undefined', 'null'.
* `node.hasType(types)` - compares against multiple types - node.hasType('number', 'object') returns true if node is either of the two  types.
* `node.isEmpty()` - returns true if this object/array has no children/elements.
* `node.filter(callback)` - traverses node's children and triggers `callback(childNode, localContext)`. The result of callback call is added to an array which is later returned by filter method. When filter method is called for a node other than root, `localContext` holds info relative to that node. If it is called for root, there is no reason to use `localContext`. See `JefLocalContext` class below.
* `node.filterFirst(callback)` - use this to traverse the first level (direct children) of node.
* `node.filterLevel(level, callback)` - iterates only nodes at specified level.
* `node.validate(callback)` - traverses node's children and triggers `callback(childNode, localContext)`. If any of the calls to callback method returns false, validate method will also return false. `localContext` is treated the same as for filter method.
* `node.remove(callback)` - traverses node's children and triggers `callback(childNode, localContext)`. Callback method is expected to return the nodes to be deleted. Either a JefNode or an array of JefNode objects may be returned. After traversal is complete the nodes are removed from Js tree. The root object is never deleted. 
* `node.refresh()` - call this to update Jef object after any of node's content have been created/updated/deleted.


**JefLocalContext class**
* `localContext.isRoot` - true if current node is the one that started filter/validate/remove operation.
* `localContext.pathArray` - string array containing the path to this node relative to current filter/validate/remove operation.
* `localContext.path` - string representation of `localContext.pathArray`.
* `localContext.level` - level of this node relative to current filter/validate operation.
* `localContext.root` - node that started filter/validate/remove operation.


## Changelog
v0.3.0
* exposed internal traverse() mechanism. Instead of require('json-easy-filter') use either require('json-easy-filter').JefNode or require('json-easy-filter').traverse.
* node.getType() is deprecated in favour of node.type()
* addedd node.remove()
* node.isLeaf behavour no longer works as in 0.3.0. See API.
* removed dependecy on <a href="https://www.npmjs.org/package/traverse" target="_blank">traverse</a>
* added node.count, node.isEmpty(), node.root, filterFirst(), filterLevel()
* added node.refresh() to support json content modification
* bug fixes

<a name="Links"></a>
## Links
* XPath like query for json - <a href="https://www.npmjs.org/package/JSONPath" target="_blank">JsonPath</a>, <a href="https://www.npmjs.org/package/spahql" target="_blank">SpahQL</a>
* Filter, map, reduce - <a href="https://www.npmjs.org/package/traverse" target="_blank">traverse</a>
* Json validator - <a href="https://www.npmjs.org/package/json-filter" target="_blank">json-filter</a>, <a href="https://www.npmjs.org/package/json-validator" target="_blank">json-validator</a>
* Linq - <a href="http://jlinq.codeplex.com/wikipage?title=Command%20List" target="_blank">jLinq</a>, <a href="http://jslinq.codeplex.com/" target="_blank">jslinq</a>
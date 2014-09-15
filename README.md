json-easy-filter
================

Javascript node module for programatic filtering and validation of Json objects.

For other similar projects see [Links](#Links) section.

## Installation
```shell
$ npm install json-easy-filter
```

## Usage
[plunkr](http://plnkr.co/edit/yZ85mr)
```js
var Jef = require('json-easy-filter');

var obj = {
		v1: 100,
		v2: 200,
		v3: {
				v4: 300,
				v5: 400
		}
};
var numbers = new Jef(obj).filter(function(node) {
		if (typeof node.value==='number') {
			return node.key + ' ' + node.value;
		}
	});

console.log(numbers);
>> [ 'v1 100', 'v2 200', 'v4 300', 'v5 400' ]
```
`filter()` will recursively traverse each node in `obj` and trigger the callback method.
`node` parameter received by callback is a wrapper around the real Js object which can be accessed using `node.key` and `node.value`.

Similar to filter method, [validate()](#exValidate) helps validating the tree and [remove()](#exRemove) provides functionality for removing individual nodes. 

Check out the examples and [API](#API) for more info.


## Examples
Use the <a href="https://raw.githubusercontent.com/gliviu/json-easy-filter/master/tests/sampleData1.js" target="_blank">sample</a> data to follow this section.

### Filter
&#35;1. node.has() [plunkr](http://plnkr.co/edit/nPwRhF)

```js
var res = new Jef(sample1).filter(function(node) {
	if (node.has('username')) {
		return node.value.username;
	}
});
console.log(res);

>> [ 'john', 'adams', 'lee', 'scott', null ] 
```
&#35;2. node.value [plunkr](http://plnkr.co/edit/x9Nq4z)
```js
var res = new Jef(sample1).filter(function(node) {
	if (node.has('salary') && node.value.salary > 200) {
		return node.value.username + ' ' + node.value.salary;
	}
});
console.log(res);
>> [ 'lee 300', 'scott 400' ] 
```

&#35;3. Paths, node.has(RegExp), level [plunkr](http://plnkr.co/edit/1t4DJ9)
```js
var res = new Jef(sample1).filter(function(node){
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

&#35;5. Array handling [plunkr](http://plnkr.co/edit/lseyjv)
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
var res = new Jef(data).filter(function(node) {
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
### Validate
&#35;1. node.validate() [plunkr](http://plnkr.co/edit/L7q3VH)
```js
var res = new Jef(sample1).validate(function(node) {
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
var res = new Jef(sample1).validate(function(node) {
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
	} else if(node.get('employees').getType()!=='array'){
		valid = false;
		info.push('Error: '+node.key+' department has wrong employee list type "'+node.get('employees').getType()+'"');
	} else if(node.value.employees.length===0){
		info.push('Warning: '+node.key+' department has no employees');
	}
}
if (node.parent && node.parent.key==='employees' && node.getType()==='object') {
	// Inside employee
	if(!node.has('username') || node.get('username').getType()!=='string'){
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
&#35;3. Nested validator [plunkr](http://plnkr.co/edit/Z43d0e)
```js
var info = [];
var res = new Jef(sample1).get('departments').validate(function (node, local) {
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
### Remove
&#35;1. node.remove() [plunkr](http://plnkr.co/edit/UzVghb)
```js
var sample = JSON.parse(JSON.stringify(sample1));
var success = new Jef(sample).remove(function(node) {
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
    if(node.parent && node.parent.key==='employees' && node.getType()==='object'){
        if(node.has('salary') && node.get('salary').getType()==='number' && node.value.salary<400){
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

<a name="API"></a>
## API

**Jef class**
* `Jef(jsonData)` - traverses jsonData and computes a collection of `JefNode` objects used later for filter/validate operations. Returns the root `JefNode`.

**JefNode class**
Wrapps a real Js node inside the tree that is traversed.
* `node.key` - the key of the currently traversed object.
* `node.value` - the value of the currently traversed object.
* `node.isRoot` - true if current node is the root of the object tree.
* `node.pathArray` - string array containing the path to current node.
* `node.path` - string representation of `node.pathArray`.
* `node.level` - level of the current node. Root node has level 0.
* `node.isLeaf` - indicates a leaf node. For {x: '{y: 'z'}, A: {}}' only y: 'z' is considered leaf node.
* `node.isCircular` - indicates a circular reference 
* `node.has(propertyName)` - returns true if `node.value` has that property. If a regular expression is passed, all `node.value` property names are iterated and matched against pattern. 
* `node.get(relativePath)` - returns the `JefNode` relative to current node or 'undefined' if path cannot be found.
* `node.getType()` - returns the type of `node.value` as one of 'string', 'array', 'object', 'function', 'undefined', 'number', 'boolean', 'null'.
* `node.filter(callback)` - traverses node's children and triggers `callback(childNode, localContext)`. The result of callback call is added to an array which is later returned by filter method. When filter method is called for a node other than root, `localContext` holds info relative to that node. If it is called for root `localContext` is equivalent to `childNode`. See `JefLocalContext` class below.   
* `node.validate(callback)` - traverses node's children and triggers `callback(childNode, localContext)`. If any of the calls to callback method returns false, validate method will also return false. `localContext` is treated the same as for filter method.
* `node.remove(callback)` - traverses node's children and triggers `callback(childNode, localContext)`. Callback method is expected to return the nodes to be deleted. Either a JefNode or an array of JefNode objects may be returned. After traversal is completed the nodes are removed from Js tree. The root object is never deleted.
`node.remove(callback)` returns: true in case of success; false if anything other than JefNode is returned by callback method.

**JefLocalContext class**
* `localContext.isRoot` - true if current node is the root of the object tree relative to current filter/validate operation.
* `localContext.pathArray` - string array containing the path to current node relative to current filter/validate operation.
* `localContext.path` - string representation of `localContext.pathArray`.
* `localContext.level` - level of the current node relative to current filter/validate operation.


<a name="Links"></a>
## Links
* XPath like query for json - <a href="https://www.npmjs.org/package/JSONPath" target="_blank">JsonPath</a>, <a href="https://www.npmjs.org/package/spahql" target="_blank">SpahQL</a>
*  Filter, map, reduce - <a href="https://www.npmjs.org/package/traverse" target="_blank">traverse</a>
* Json validator - <a href="https://www.npmjs.org/package/json-filter" target="_blank">json-filter</a>

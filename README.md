json-easy-filter
================

Javascript node module for convenient json filtering or programatic querying


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
		return node.value;
	}
});

console.log(numbers);
```

displays [ 100, 200, 300, 400 ]

## Examples

Sample data
```js
var json = {
	departments : {
		admin : {
			name : "Administrative",
			manager : 'john',
			employees : [ 'john', 'anna' ]
		},
		it : {
			name : 'IT',
			manager : 'andy',
			employees : [ 'gaby', 'john', 'boby' ]
		},
		finance : {
			name : 'Financiar',
			manager : 'anna',
			employees : [ 'andy', 'gaby', 'anna' ]
		}
	},
	employees : [
		{
			username : 'john',
			firstName : 'John',
			lastName : 'JOHN',
			salary : 150,
			gender : 'M',
			birthDate : '1980/05/21'
		}, 
		{
			username : 'andy',
			firstName : 'Andy',
			lastName : 'ANDY',
			salary : 200,
			gender : 'M',
			birthDate : '1985/10/30'
		}, 
		{
			username : 'anna',
			firstName : 'Anna',
			lastName : 'ANNA',
			salary : 300,
			gender : 'F',
			birthDate : '1989/08/05'
		}, 
		{
			username : 'gaby',
			firstName : 'Gaby',
			lastName : 'GABY',
			salary : 400,
			gender : 'M',
			birthDate : '1993/11/20'
		}, 
		{
			username : null,
			firstName : 'Unknown',
			lastName : 'Unknown',
			salary : 100,
			gender : 'M',
			birthDate : '1993/11/20'
		} 
	]
};
```

Display all usernames.
```js
var res = jef(json).filter(function(node) {
	if (node.hasOwnProperty('username')) {
		return node.value.username;
	}
});
console.log(res);
```
shows 
```js 
[ 'john', 'andy', 'anna', 'gaby', null ] 
```


All employee usernames with a salary over 200
```js
var res = jef(json).filter(function(node) {
	if (node.has('salary') && node.value.salary > 200) {
		return node.value.username + ' ' + node.value.salary;
	}
});
console.log(res);
```
shows 
```js 
[ 'anna 300', 'gaby 400' ] 
```

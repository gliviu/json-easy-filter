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

will display [ 100, 200, 300, 400 ]

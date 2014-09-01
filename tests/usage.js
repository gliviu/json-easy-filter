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
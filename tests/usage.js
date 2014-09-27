var JefNode = require('json-easy-filter').JefNode;

var obj = {
		v1: 100,
		v2: 200,
		v3: {
				v4: 300,
				v5: 400
		}
};
var numbers = new JefNode(obj).filter(function(node) {
		if (node.type()==='number') {
			return node.key + ' ' + node.value;
		}
	});

console.log(numbers);
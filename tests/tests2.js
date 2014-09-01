var jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');


var Tests2 = function(){
	this.test1 = function() {
		var res = jef(sample1).get('departments.admin').filter(function(node) {
			if (node.value.manager === 'john') {
				return node.value.manager;
			}
		});
		var testResult = res.toString() === [ 'john' ].toString();
		return testResult;
	}
};

module.exports = function(){
	return new Tests2(); 
};

var jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');


var Tests1 = function(){
	/**
	 * All usernames.
	 */
	this.test1 = function() {
		var res = jef(sample1).filter(function(node) {
			if (node.hasOwnProperty('username')) {
				return node.value.username;
			}
		});
		// console.log(res);
		var testResult = res.toString() === [ 'john', 'adams', 'lee', 'scott', null ]
				.toString();
		return testResult;
	};

	/**
	 * All usernames with salary over 200.
	 */
	this.test2 = function() {
		var res = jef(sample1).filter(function(node) {
			if (node.has('salary') && node.value.salary > 200) {
				return node.value.username + ' ' + node.value.salary;
			}
		});
		// console.log(res);
		var testResult = res.toString() === [ 'lee 300', 'scott 400' ].toString();
		return testResult;
	};

};

module.exports = function(){
	return new Tests1(); 
};

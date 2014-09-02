"use strict";

var Jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');


var Tests2 = function(){
	this.test1 = function() {
		var res = new Jef(sample1).get('departments.admin').filter(function(node) {
			if (node.value.manager === 'john') {
				return node.value.manager;
			}
		});
		var testResult = res.toString() === [ 'john' ].toString();
		return testResult;
	};
	this.test2 = function(printResult) {
		var res = new Jef(sample1).get('employees').parent.isRoot;
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === true.toString();
		return testResult;
	};
};

module.exports = function(){
	return new Tests2(); 
};

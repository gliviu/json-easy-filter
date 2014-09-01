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

	/**
	 * Validate departments have managers
	 */
	this.test3 = function(printResult) {
		var res = jef(sample1).validate(function(node) {
			if (node.parent && node.parent.key==='departments' && !node.has('manager')) {
				return false;
			}
		});
		if(printResult){
			console.log(res.toString());
		}
		// console.log(res);
		var testResult = res.toString() === false.toString();
		return testResult;
	};

	
	/**
	 * Validate departments and employees
	 */
	this.test4 = function(printResult) {
		var info = [];
		var res = jef(sample1).validate(function(node) {
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
				} else if(node.value.employees.length==0){
					info.push('Warning: '+node.key+' department has no employees');
				}
			}
			return valid;
		});
		if(printResult){
			console.log(res.toString());
			console.log(info);
		}
		var testResult = res.toString() === false.toString();
		return testResult;
	};

	
	
};

module.exports = function(){
	return new Tests1(); 
};

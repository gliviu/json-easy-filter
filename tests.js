var jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');

/**
 * All usernames.
 */
function test1() {
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

function test2() {
	var res = jef(sample1).get('departments.admin').filter(function(node) {
		if (node.value.manager === 'john') {
			return node.value.manager;
		}
	});
	var testResult = res.toString() === [ 'john' ].toString();
	return testResult;
}

/**
 * All usernames with salary over 200.
 */
function test3() {
	var res = jef(sample1).filter(function(node) {
		if (node.has('salary') && node.value.salary > 200) {
			return node.value.username + ' ' + node.value.salary;
		}
	});
	// console.log(res);
	var testResult = res.toString() === [ 'lee 300', 'scott 400' ].toString();
	return testResult;
};

function passed(value){
	return value?'Passed':'Failed';
}

function runTests() {
	var res = test1();
	console.log('Test1: ' + passed(res));
	var res = test2();
	console.log('Test2: ' + passed(res));
	var res = test3();
	console.log('Test3: ' + passed(res));
}

console.log('');
// test1();
runTests();

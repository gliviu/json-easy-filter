"use strict";

var tests1 = require('./tests1-examples')();
var tests2 = require('./tests2')();
var Jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');





function passed(value){
	return value?'Passed':'!!!!FAILED!!!!';
}

function runTests() {
	var res = null;
	console.log('Tests1 - filter');
	res = tests1.test1_filter();
	console.log('tests1/test1_filter: ' + passed(res));
	res = tests1.test2_filter();
	console.log('tests1/test2_filter: ' + passed(res));
	res = tests1.test3_filter();
	console.log('tests1/test3_filter: ' + passed(res));
	res = tests1.test4_filter();
	console.log('tests1/test4_filter: ' + passed(res));
	res = tests1.test5_filter();
	console.log('tests1/test5_filter: ' + passed(res));
	res = tests1.test6_filter();
	console.log('tests1/test6_filter: ' + passed(res));
	res = tests1.test7_filter();
	console.log('tests1/test7_filter: ' + passed(res));

	console.log('\nTests1 - validate');
	res = tests1.test1_validate();
	console.log('tests1/test1_validate: ' + passed(res));
	res = tests1.test2_validate();
	console.log('tests1/test2_validate: ' + passed(res));
	res = tests1.test3_validate();
	console.log('tests1/test3_validate: ' + passed(res));
	
	console.log('\nTests2');
	res = tests2.test1();
	console.log('tests2/test1: ' + passed(res));
	res = tests2.test2();
	console.log('tests2/test2: ' + passed(res));
	res = tests2.test3();
	console.log('tests2/test3: ' + passed(res));
	res = tests2.test4();
	console.log('tests2/test4: ' + passed(res));
	res = tests2.test5(false);
	console.log('tests2/test5: ' + passed(res));
}


runTests();




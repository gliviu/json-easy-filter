var tests1 = require('./tests1-examples')();
var tests2 = require('./tests2')();





function passed(value){
	return value?'Passed':'Failed';
}

function runTests() {
	var res = null;
	// Tests1
	res = tests1.test1();
	console.log('tests1/test1: ' + passed(res));
	res = tests1.test2();
	console.log('tests1/test2: ' + passed(res));
	res = tests1.test3();
	console.log('tests1/test3: ' + passed(res));
	res = tests1.test4(true);
	console.log('tests1/test4: ' + passed(res));
	
	// Tests1
	console.log();
	res = tests2.test1();
	console.log('tests2/test1: ' + passed(res));
}


runTests();
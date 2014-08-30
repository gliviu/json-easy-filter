var jef = require('./JsonEasyFilter');

var json = {
	departments : {
		admin : {
			name : "Administrative",
			manager : 'john',
			employees : [ 'john', 'anna' ]
		},
		it : {
			name : 'IT',
			manager : 'andy',
			employees : [ 'gaby', 'john', 'boby' ]
		},
		finance : {
			name : 'Financiar',
			manager : 'anna',
			employees : [ 'andy', 'gaby', 'anna' ]
		}
	},
	employees : [ {
		username : 'john',
		firstName : 'John',
		lastName : 'JOHN',
		salary : 150,
		gender : 'M',
		birthDate : '1980/05/21'
	}, {
		username : 'andy',
		firstName : 'Andy',
		lastName : 'ANDY',
		salary : 200,
		gender : 'M',
		birthDate : '1985/10/30'
	}, {
		username : 'anna',
		firstName : 'Anna',
		lastName : 'ANNA',
		salary : 300,
		gender : 'F',
		birthDate : '1989/08/05'
	}, {
		username : 'gaby',
		firstName : 'Gaby',
		lastName : 'GABY',
		salary : 400,
		gender : 'M',
		birthDate : '1993/11/20'
	}, {
		username : null,
		firstName : 'Unknown',
		lastName : 'Unknown',
		salary : 100,
		gender : 'M',
		birthDate : '1993/11/20'
	} ]
};

/**
 * All employee usernames.
 */
function test1() {
	var res = jef(json).filter(function(node) {
		if (node.hasOwnProperty('username')) {
			return node.value.username;
		}
	});
//	 console.log(res);
	var testResult = res.toString() === [ 'john', 'andy', 'anna', 'gaby', null ]
			.toString();
	return testResult;
};

function test2() {
	var res = jef(json).get('departments.admin').filter(
			function(node) {
				if (node.value.manager === 'john') {
					return node.value.manager;
				}
			});
	var testResult = res.toString() === [ 'john' ].toString();
	return testResult;
}

/**
 * All employee usernames with a salary over 200.
 */
function test3() {
	var res = jef(json).filter(function(node) {
		if (node.has('salary') && node.value.salary > 200) {
			return node.value.username + ' ' + node.value.salary;
		}
	});
	// console.log(res);
	var testResult = res.toString() === [ 'anna 300', 'gaby 400' ].toString();
	return testResult;
};

function runTests() {
	var res = test1();
	console.log('Test1: ' + res);
	var res = test2();
	console.log('Test2: ' + res);
	var res = test3();
	console.log('Test3: ' + res);
}

console.log('start');
// test1();
 runTests();

"use strict";

var Jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');


var Tests1 = function(){
	/**
	 * node.has()
	 */
	this.test1_filter = function(printResult) {
		var res = new Jef(sample1).filter(function(node) {
			if (node.has('username')) {
				return node.value.username;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'john', 'adams', 'lee', 'scott', null ]
		.toString();
		return testResult;
	};

	/**
	 * node.value
	 */
	this.test2_filter = function(printResult) {
		var res = new Jef(sample1).filter(function(node) {
			if (node.has('salary') && node.value.salary > 200) {
				return node.value.username + ' ' + node.value.salary;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'lee 300', 'scott 400' ].toString();
		return testResult;
	};

	// Paths, node.has(RegExp), level
	this.test3_filter = function(printResult){
		var res = new Jef(sample1).filter(function(node){
			if(node.has(/^(phone|email|city)$/)){
				return 'contact: '+node.path;
			}
			if(node.pathArray[0]==='departments' && node.pathArray[1]==='admin' && node.level===3){
				return 'department '+node.key+': '+node.value;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'department name: Administrative',
		                                      'department manager: john',
		                                      'department employees: john,lee',
		                                      'contact: employees.0.contact.0',
		                                      'contact: employees.0.contact.1',
		                                      'contact: employees.0.contact.2.address' ].toString();
		return testResult;
	};


	// node.key, node.parent and node.get()
	this.test4_filter = function(printResult){
		var res = new Jef(sample1).filter(function(node){
			if(node.key==='email' && node.value==='a@b.c'){
				var res = [];
				res.push('Email: key - '+node.key+', value: '+node.value+', path: '+node.path);

				if(node.parent){ // Test parent exists
					var emailContainer = node.parent;
					res.push('Email parent: key - '+emailContainer.key+', type: '+emailContainer.getType()+', path: '+emailContainer.path);
				}

				if(node.parent && node.parent.parent){
					var contact = node.parent.parent;
					res.push('Contact: key - '+contact.key+', type: '+contact.getType()+', path: '+contact.path);

					var city = contact.get('2.address.city');
					if(city){ // Test relative path exists. node.get() returns 'undefined' otherwise.
						res.push('City: key - '+city.key+', type: '+city.value+', path: '+city.path);
					}
				}

				return res;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ [ 'Email: key - email, value: a@b.c, path: employees.0.contact.1.email',
		                                        'Email parent: key - 1, type: object, path: employees.0.contact.1',
		                                        'Contact: key - contact, type: array, path: employees.0.contact',
		                                        'City: key - city, type: NY, path: employees.0.contact.2.address.city' ] ].toString();
		return testResult;
	};

	/**
	 * Array handling
	 */
	this.test5_filter = function(printResult) {
		var res = new Jef(sample1).filter(function(node){
			if(node.parent && node.parent.key==='employees'){
				if(node.getType()==='object'){
					return 'key: '+node.key+', username: '+node.value.username+', path: '+node.path;
				} else{
					return 'key: '+node.key+', username: '+node.value+', path: '+node.path;
				}
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'key: 0, username: john, path: departments.admin.employees.0',
		                                      'key: 1, username: lee, path: departments.admin.employees.1',
		                                      'key: 0, username: scott, path: departments.it.employees.0',
		                                      'key: 1, username: john, path: departments.it.employees.1',
		                                      'key: 2, username: lewis, path: departments.it.employees.2',
		                                      'key: 0, username: adams, path: departments.finance.employees.0',
		                                      'key: 1, username: scott, path: departments.finance.employees.1',
		                                      'key: 2, username: lee, path: departments.finance.employees.2',
		                                      'key: 0, username: john, path: employees.0',
		                                      'key: 1, username: adams, path: employees.1',
		                                      'key: 2, username: lee, path: employees.2',
		                                      'key: 3, username: scott, path: employees.3',
		                                      'key: 4, username: null, path: employees.4',
		                                      'key: 5, username: undefined, path: employees.5' ].toString();
		return testResult;
	};

	/**
	 * Circular references
	 */
	this.test6_filter = function(printResult) {
		var data = {
			x: {
				y: null  
			},
			z: null,
			t: null
		};
		data.z = data.x;
		data.x.y = data.z;
		data.t = data.z;
		var res = new Jef(data).filter(function(node) {
			if(node.isRoot){
				return 'root';
			} else if (node.isCircular) {
				return 'circular key: '+node.key + ', path: '+node.path;
			} else{
				return 'key: '+node.key + ', path: '+node.path;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'root',
		                                      'key: x, path: x',
		                                      'circular key: y, path: x.y',
		                                      'key: z, path: z',
		                                      'circular key: y, path: z.y',
		                                      'key: t, path: t',
		                                      'circular key: y, path: t.y' ].toString();
		return testResult;
	};

	/**
	 * Subfilters
	 */
	this.test7_filter = function(printResult) {
		var res = new Jef(sample1).get('employees.0.contact').filter(function(node, local) {
			if(node.key==='phone'){
				return [
				        'phone global context - isRoot: '+node.isRoot+', level: '+node.level+', path: "'+node.path+'"',
				        'phone local context- isRoot: '+local.isRoot+', level: '+local.level+', path: "'+local.path+'"'
				        ];
			}
			if(local.isRoot){
				return [
				        'contact global context - isRoot: '+node.isRoot+', level: '+node.level+', path: "'+node.path+'"',
				        'contact local context- isRoot: '+local.isRoot+', level: '+local.level+', path: "'+local.path+'"'
				        ];
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ [ 'contact global context - isRoot: false, level: 3, path: "employees.0.contact"',
		                                        'contact local context- isRoot: true, level: 0, path: ""' ],
		                                        [ 'phone global context - isRoot: false, level: 5, path: "employees.0.contact.0.phone"',
		                                          'phone local context- isRoot: false, level: 2, path: "0.phone"' ] ].toString();
		return testResult;
	};
	

	/**
	 * node.validate()
	 */
	this.test1_validate = function(printResult) {
		var res = new Jef(sample1).validate(function(node) {
			if (node.parent && node.parent.key==='departments' && !node.has('manager')) {
				// current department is missing the mandatory 'manager' property
				return false;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === false.toString();
		return testResult;
	};

	/**
	 * Validation info
	 */
	this.test2_validate = function(printResult) {
		var info = [];
		var res = new Jef(sample1).validate(function(node) {
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
				} else if(node.value.employees.length===0){
					info.push('Warning: '+node.key+' department has no employees');
				}
			}
			if (node.parent && node.parent.key==='employees' && node.getType()==='object') {
				// Inside employee
				if(!node.has('username') || node.get('username').getType()!=='string'){
					valid = false;
					info.push('Error: Employee '+node.path+' does not have username');
				} else if(!node.has('gender')){
					info.push('Warning: Employee '+node.value.username+' does not have gender');
				}
			}

			return valid;
		});
		if(printResult){
			console.log(res);
			console.log(info);
		}
		var testResult1 = res.toString() === false.toString();
		var testResult2 = info.toString() === [ 'Error: marketing department is missing mandatory manager property',
		                                        'Warning: marketing department has no employees',
		                                        'Error: hr department is missing mandatory manager property',
		                                        'Error: hr department is missing mandatory employee list',
		                                        'Error: supply department is missing mandatory manager property',
		                                        'Error: supply department has wrong employee list type "string"',
		                                        'Warning: Employee scott does not have gender',
		                                        'Error: Employee employees.4 does not have username',
		                                        'Error: Employee employees.5 does not have username' ].toString();
		return testResult1 && testResult2;
	};

	/**
	 * Sub validator
	 */
	this.test3_validate = function(printResult) {
		var info = [];
		var res = new Jef(sample1).get('departments').validate(function(node, local) {
			var valid = true;
			if (local.level===1) {
				// Inside department
				if(!node.has('manager')){
					valid = false;
					info.push('Error: '+local.path+'('+node.path+')'+' department is missing mandatory manager property');
				}
			}
			return valid;
		});
		if(printResult){
			console.log(res);
			console.log(info);
		}
		var testResult1 = res.toString() === false.toString();
		var testResult2 = info.toString() === [ 'Error: marketing(departments.marketing) department is missing mandatory manager property',
		                                        'Error: hr(departments.hr) department is missing mandatory manager property',
		                                        'Error: supply(departments.supply) department is missing mandatory manager property' ].toString();
		return testResult1 && testResult2;
	};



};

module.exports = function(){
	return new Tests1(); 
};

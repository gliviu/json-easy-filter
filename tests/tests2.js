"use strict";

var fs = require('fs');
var Jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');


var Tests2 = function(){
	this.test1 = function(printResult) {
		var res = new Jef(sample1).get('departments.admin').filter(function(node) {
			if (node.value.manager === 'john') {
				return node.value.manager;
			}
		});
		if(printResult){
			console.log(res);
		}
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
	this.test3 = function(printResult) {
		var res = new Jef(sample1).filter(function(node) {
			if(node.isRoot) {
				return 'Root node - level='+node.level+', path: '+node.path+', pathLength='+node.pathArray.length;
			}
			if(node.key==='departments'){
				return 'Departments node - level='+node.level+', path: '+node.path+', pathLength='+node.pathArray.length;
			}
			if(node.has('username') && node.value.username==='john'){
				var email = node.get('contact.1.email');
				return 'Email node - level='+email.level+', path: '+email.path+', pathLength='+email.pathArray.length;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'Root node - level=0, path: , pathLength=0',
		                                      'Departments node - level=1, path: departments, pathLength=1',
		                                      'Email node - level=5, path: employees.0.contact.1.email, pathLength=5' ].toString();
		return testResult;
	};
	this.test4 = function(printResult) {
		var res = new Jef(sample1).filter(function(node) {
			if(node.isLeaf && node.level>3) {
				return node.path;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'departments.admin.employees.0',
		                                      'departments.admin.employees.1',
		                                      'departments.it.employees.0',
		                                      'departments.it.employees.1',
		                                      'departments.it.employees.2',
		                                      'departments.finance.employees.0',
		                                      'departments.finance.employees.1',
		                                      'departments.finance.employees.2',
		                                      'employees.0.contact.0.phone',
		                                      'employees.0.contact.1.email',
		                                      'employees.0.contact.2.type',
		                                      'employees.0.contact.2.address.city',
		                                      'employees.0.contact.2.address.country' ].toString();
		return testResult;
	};
	this.test5 = function(printResult) {
		var res = new Jef({x: {y: 'z'}, A: {}}).filter(function(node) {
			if (node.isLeaf) {
				return node.path;
			}
		});
		if(printResult){
			console.log(res);
		}
		var testResult = res.toString() === [ 'x.y', 'A' ].toString();
		return testResult;
	};
	// http://stackoverflow.com/questions/25678022/how-to-use-jquery-grep-to-filter-extremely-nested-json
    this.test6 = function() {
        var sample = require('./tests2-test6-input');
        var start = new Date('2015-01-03');
        var end = new Date('2015-01-07');
        var success = new Jef(sample).remove(function(node) {
            if (node.has('requests')) {
                var requests = node.value.requests;
                for(var i = 0; i<requests.length; i++){
                    var request = requests[i];
                    var pick = new Date(request.pickupdate);
                    var ret = new Date(request.returndate);
                    if(!((pick<start && ret<start ) || (pick>end && ret>end ))){
                        // pickupdate-returndate overlaps with start-end
                        return node;
                    }
                }
            }
        });
        
        if(false){
            console.log(JSON.stringify(sample, null, 4));
            console.log(success);
        }
        var expected = JSON.parse(fs.readFileSync('tests2-test6-expected.json', 'utf8'));
        var testResult = JSON.stringify(sample, null, 4) === JSON.stringify(expected, null, 4) && success;
        return testResult;
    };	
};

module.exports = function(){
	return new Tests2(); 
};

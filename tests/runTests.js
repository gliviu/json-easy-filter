"use strict";
var colors = require('colors');
var tests1 = require('./tests1-examples')();
var tests2 = require('./tests2')();
var tests3 = require('./tests3-refresh')();
var Jef = require('json-easy-filter');
var sample1 = require('./sampleData1.js');

var count = 0, failed = 0, successful = 0;

function passed (value) {
    count++;
    if(value){
        successful++;
    } else{
        failed++;
    }
    return value ? 'Passed'.green : '!!!!FAILED!!!!'.yellow;
}


function runTests () {
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

    res = tests1.test1_delete();
    console.log('tests1/test1_delete: ' + passed(res));

    console.log('\nTests2');
    res = tests2.test1();
    console.log('tests2/test1: ' + passed(res));
    res = tests2.test2();
    console.log('tests2/test2: ' + passed(res));
    res = tests2.test3();
    console.log('tests2/test3: ' + passed(res));
    res = tests2.test4();
    console.log('tests2/test4: ' + passed(res));
    res = tests2.test5();
    console.log('tests2/test5: ' + passed(res));
    res = tests2.test6();
    console.log('tests2/test6: ' + passed(res));
    res = tests2.test7();
    console.log('tests2/test7: ' + passed(res));
    res = tests2.test8();
    console.log('tests2/test8: ' + passed(res));
    res = tests2.test9();
    console.log('tests2/test9: ' + passed(res));

    
    console.log('\nTests3 - refresh');
    res = tests3.test1();
    console.log('tests3/test1: ' + passed(res));

    console.log();
    console.log('Tests: '+count+', failed: '+failed.toString().yellow+', succeeded: '+successful.toString().green);
}

runTests();

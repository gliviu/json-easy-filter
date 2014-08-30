var sample1 = {
	departments : {
		admin : {
			name : "Administrative",
			manager : 'john',
			employees : [ 'john', 'lee' ]
		},
		it : {
			name : 'IT',
			manager : 'adams',
			employees : [ 'scott', 'john', 'lewis' ]
		},
		finance : {
			name : 'Financiar',
			manager : 'lee',
			employees : [ 'adams', 'scott', 'lee' ]
		}
	},
	employees : [ 
		{
			username : 'john',
			firstName : 'John',
			lastName : 'JOHN',
			salary : 150,
			gender : 'M',
			birthDate : '1980/05/21'
		}, 
		{
			username : 'adams',
			firstName : 'Adams',
			lastName : 'ADAMS',
			salary : 200,
			gender : 'M',
			birthDate : '1985/10/30'
		}, 
		{
			username : 'lee',
			firstName : 'Lee',
			lastName : 'LEE',
			salary : 300,
			gender : 'F',
			birthDate : '1989/08/05'
		}, 
		{
			username : 'scott',
			firstName : 'Scott',
			lastName : 'SCOTT',
			salary : 400,
			gender : 'M',
			birthDate : '1993/11/20'
		}, 
		{
			username : null,
			firstName : 'Unknown',
			lastName : 'Unknown',
			salary : 100,
			gender : 'M',
			birthDate : '1993/11/20'
		} 
	]
};

module.exports=sample1;
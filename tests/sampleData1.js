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
		},
		marketing : {
			name : 'Commercial',
			employees : []
		},
		hr : {
			name : 'Human resources',
		},
		supply: {
			employees: 'scott'
		}
	},
	employees : [ 
		{
			username : 'john',
			firstName : 'John',
			lastName : 'JOHN',
			salary : 150,
			gender : 'M',
			birthDate : '1980/05/21',
			contact: [
			          {
			        	  phone: '12345678'
			          },
			          {
			        	  email: 'a@b.c'
			          },
			          {
			        	  type: 'address',
			        	  address: {
			        		  city: 'NY',
			        		  country: 'US'
			        	  }
			          }
			]
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
			birthDate : '1993/11/20'
		}, 
		{
			username : null,
			firstName : 'Unknown',
			lastName : 'Unknown',
			salary : 100,
			gender : 'M',
			birthDate : '1993/11/20'
		}, 
		{
			firstName : 'Unknown2',
			lastName : 'Unknown2',
		} 
	]
};

module.exports=sample1;
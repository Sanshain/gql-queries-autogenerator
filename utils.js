//@ts-check

const http = require('http');



const queriesInfoQuery = { 
// 	query : `{
// 		  __schema {
// 		  types {
// 			  name,
// 			  fields {
// 				  name
// 			  }
// 		  }
// 		  }
// 	  }
//   `,

  query: `
	{
		__schema {
			types {
				name,
				fields {
					name,
					type {
						name,
						ofType {
							name					  
						}
					}
				}
			},
			mutationType{
				name,
				fields{
				  name,
				  description,
				  type{
					 name,
					 fields{
						name,
						type{
							fields{
							  name
							}
						 }						         
					 }
				  }
				}
			 }			
		}		
	}
  `,

//   query: `
//   {
// 		__schema {
// 			types {
// 				name,
// 				fields {
// 					name,
// 					type {
// 						name,
// 						ofType {
// 							name					  
// 						},
// 						fields{
// 							name,
// 							type{
// 								name,
// 								fields{
// 									name,
// 									type{
// 										name
// 									}
// 								}
// 							}
// 						}          
// 					}
// 				}
// 			}
// 		}
// 	}  
//   `,
  variables: null
}



function getTypes(typesHandler) {
	const options = {
		hostname: '127.0.0.1',
		port: 8000,
		path: '/graphql',
		method: 'POST',
		headers: {'Content-Type': 'application/json'}
	 }
	
	const request = http.request(options, (response) => {
		
		console.log(`statusCode: ${response.statusCode}`)
		response.on('data', (d) => typesHandler(JSON.parse(d.toString())));		//   process.stdout.write(d)			
	 })
	
	 request.on('error', e => console.log(e));	 
	 request.write(JSON.stringify(queriesInfoQuery))
	 request.end()	
}

module.exports = {getTypes}
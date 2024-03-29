//@ts-check

const http = require('http');
const fs = require('fs')
const path = require('path')
const { exec, execSync } = require('child_process')



const queriesInfoQuery = {
   //    query : `{
   //         __schema {
   //         types {
   //            name,
   //            fields {
   //               name
   //            }
   //         }
   //         }
   //      }
   //   `,

   query: `
   {
      __schema {
         types {
            name,
            fields {
               name,      
               description,         
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
					args{
						name,
						type{
					   	ofType{
								name
							}
						}
					},
               type{
                  name,
                  fields{
                     name,
                     type{
                        fields{
                           name,
                           type{
                              name,
                              ofType{
                                 name
                              },
                           }
                        },
								ofType{
									name
								}								
                     },
                  },					
               },				
            }
         }         
      }
   }
  `,

   //   query: `
   //   {
   //       __schema {
   //          types {
   //             name,
   //             fields {
   //                name,
   //                type {
   //                   name,
   //                   ofType {
   //                      name                 
   //                   },
   //                   fields{
   //                      name,
   //                      type{
   //                         name,
   //                         fields{
   //                            name,
   //                            type{
   //                               name
   //                            }
   //                         }
   //                      }
   //                   }          
   //                }
   //             }
   //          }
   //       }
   //    }  
   //   `,
   variables: null
}



/**
 * @param {(arg: object) => void} typesHandler
 * @param {{port?: number, host?: string}} serverOptions
 */
function getTypes(typesHandler, serverOptions) {
   const options = {
      hostname: serverOptions.host || '127.0.0.1',
      port: serverOptions.port || 8000,
      path: '/graphql',
      method: 'POST',
      // maxHeaderSize: 65536,
      headers: { 'Content-Type': 'application/json' }
   }

   const request = http.request(options, (response) => {

      let data = ''

      console.log(`statusCode: ${response.statusCode}`)
      response.on('data', (d) => {
         // при больщом объеме json выдает не весь ответ
         // return typesHandler(JSON.parse(d.toString()));
         data += d.toString();
      });      //   process.stdout.write(d)      

      response.on('end', () => {
         if (response.statusCode == 200) return typesHandler(JSON.parse(data));
         else {
            fs.existsSync('.errors') || fs.mkdirSync('.errors')
            // let errorFileName = path.dirname(__dirname) +'\\.errors\\error.html';            
            fs.writeFileSync('.errors' + path.sep + 'error.html', data, {
               flag: 'w'
            })
            try {
               execSync('start .errors\\error.html')
            }
            catch {
               try {
                  execSync('start ' + 'http://' + options.hostname + ':' + options.port + options.path)
               }
               catch { }
            }
            finally {
               throw new Error('data');
            }
         }
      });
   })

   request.on('error', e => console.log(e));
   request.write(JSON.stringify(queriesInfoQuery))
   request.end()
}

module.exports = { getTypes }
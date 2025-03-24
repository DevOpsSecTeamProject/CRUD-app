const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    "openapi": "3.0.0",
    "info": {
        "title": "Todo Backend Docs",
        "version": "1.0.0",
        "port": 8081
    },
    "paths": {
        "/todos": {
            "post": {
                "description": "Task required in the body of the request e.g., {task: 'Walk the cat'}",
                "responses": {
                    "201": {
                        "description": "Returns a blank object."
                    }
                }
            },
            "get": {
                "description": "No inputs required",
                "responses": {
                    "200": {
                        "description": "Returns an object of todos."
                    }
                }
            },
            "put": {
                "description": "ID and task required in the body of the request e.g., {todo_id: 1, task: 'Get food'}",
                "responses": {
                    "204": {
                        "description": "Returns a blank object."
                    }
                }
            },
            "delete": {
                "description": "ID data required in the body of the request e.g., {data: {todo_id: 1}}",
                "responses": {
                    "204": {
                        "description": "Returns a blank object."
                    }
                }
            }
        }
    },
    "components": {},
    "tags": []
},
  apis: ['./routes/index.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
const fs = require('fs')

fs.writeFile('./docs.json', JSON.stringify(openapiSpecification, null, '\t'), err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})

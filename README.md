# fastify-partials-compra
14. [Guardar el resultado en un archivo json con fs-extra](#schema14)

<hr>

<a name="schema1"></a>

# 1 Instalar Yarn 
Comprobar con 
~~~bash
yarn --version
~~~
<hr>

<a name="schema2 "></a>

# 2 Arrancar yarn
~~~bash
yarn init -y
~~~


<hr>

<a name="schema3"></a>

# 3 Instalar los paquetes necesarios
~~~
yarn add fastify pino pino-pretty nodemon fastify-static handlebars point-of-view fastify-formbody typescript ts-node-dev 
~~~

<hr>

<a name="schema4"></a>

# 4 Añadir el script para que compile Typescript y ejecutarlo
~~~js
 "scripts": {
    "start": "node src/app.js",
    "dev":"ts-node-dev src/server.js",
    "build": "tsc"
      },
~~~

~~~bash
yarn build tsc --init
~~~

# 5 Añadimos el server
~~~js
import fastify from "fastify";


const server = fastify({
    logger:{
        prettyPrint:true
    },
    disableRequestLogging:false
})

const PORT= 3000;
server.listen(PORT)
~~~

# 6 Creamos app
~~~ js
import {FastifyPluginAsync} from "fastify"
import path from "path"
import { main_router } from "../routers/main.router";

export const main_app: FastifyPluginAsync =async (app) => {
    app.register(require("fastify-static"),{
        root: path.join(__dirname, "../public"),
        prefix:"/staticFiles",
    });
    app.register(require("point-of-view"), 
    {
        engine: {
            handlebars: require("handlebars"),
        },
        layout: "./views/layouts/main.hbs",
    });
    app.register(require("fastify-formbody"));
    app.register(main_router);
}
~~~
Para que esto funcione necesitamos instalar 
~~~
yarn add @types/node
~~~
Cambiamos el require por: `fastifyStatic`, `pointOfView` y `formBodyPlugin`
~~~js
import {FastifyPluginAsync} from "fastify"
import formBodyPlugin from "fastify-formbody";
import fastifyStatic from "fastify-static";
import path from "path"
import pointOfView from "point-of-view";
import { main_router } from "../routers/main.router";

export const main_app: FastifyPluginAsync =async (app) => {
    app.register(fastifyStatic,{
        root: path.join(__dirname, "../public"),
        prefix:"/staticFiles",
    });
    app.register(pointOfView, 
    {
        engine: {
            handlebars: require("handlebars"),
        },
        layout: "./views/layouts/main.hbs",
    });
    app.register(formBodyPlugin);
    app.register(main_router);
}
~~~

# 7 Creamos main_router
~~~js
import { FastifyPluginAsync } from "fastify"



const home = (request: any, reply: any) => {
    const data = { title: "Your Shopping list" };
    reply.view("views/index", data);
}
export const main_router:FastifyPluginAsync =async (app) => {
    app.get("/", home)
}
~~~

# 8 Creamos index.hbs y main.hbs
`index.hbs`
~~~html
<h1>{{title}}</h1>
~~~
` main.hbs`
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    {{{body}}}
</body>
</html>
~~~
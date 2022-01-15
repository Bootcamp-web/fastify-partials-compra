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
Añadimos `app.register(list_router, { prefix: "/list" });`
para poder enroutar a list_router
~~~js
import {FastifyPluginAsync} from "fastify"
import formBodyPlugin from "fastify-formbody";
import fastifyStatic from "fastify-static";
import path from "path"
import pointOfView from "point-of-view";
import { main_router } from "../routers/main.router";
import { list_router } from "../routers/list.router";

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
    app.register(list_router, { prefix: "/list" });
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
Añadimos `list`
~~~js
import { FastifyPluginAsync } from "fastify"
import {list} from "./list.router"


const home = (request: any, reply: any) => {
    const data = { title: "Your Shopping list", list };
    reply.view("views/index", data);
}
export const main_router:FastifyPluginAsync =async (app) => {
    app.get("/", home)
}

~~~

# 8 Creamos index.hbs y main.hbs
- `index.hbs`
~~~html
<h1>{{title}}</h1>
~~~
Lo modificamos para poder coger los datos que nos entren al pulsar añadir
~~~html
<h1>{{title}}</h1>
<ul>
    {{#each list}}
    <li>Productos:{{this.ingrediente}}, Cantidad:{{this.cantidad}}</li>
    {{/each}}
</ul>

<a href="/list/add">Añadir</a>
~~~



- ` main.hbs`
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

# 9 Creamos add.hbs 
~~~html
<h1>{{title}}</h1>

<form action = "/list/form" method="POST">
	<p>Ingrediente:</p>
	<input name="ingrediente" />
	<p>Cantidad</p>
	<input name="cantidad" />
	<p></p>
	<button type="submit">Añadir</button>
</form>
<a href="/">Back</a> 
~~~


# 10 Añadimos la funcionalidad `remove ingredient`
- Modificamos `index.hbs`
Añadimos un enlace para que borre cierto elemento. Tenemos que crear un id para cada elemento de la lista
~~~html
<h1>{{title}}</h1>
<ul>
    {{#each list}}
    <li>Productos: {{ this.ingrediente }}. Cantidad: {{ this.cantidad }} 
        <a href="/remove?id={{this.id}}">Delete</a>
    </li>
    {{/each}}
</ul>

<a href="/list/add">Añadir</a>
~~~
- Modificamos `list_router`, para poner un `id` a cada elemento, con un contador
~~~js
import {FastifyPluginAsync} from "fastify"
import { request } from "http"

 
export let list= [
    {ingrediente:"Papas", cantidad:3,id:0 },
    {ingrediente:"Cebollas",cantidad:6,id:1},
    {ingrediente:"Huevos",cantidad:6,id:2},
]
let cont = 3;
const add = (request: any, reply:any)=>{
    const data ={title: "Add items to your shopping list"}
    
    reply.view("views/add",data)
}

const form = (request: any, reply:any)=>{
    const { ingrediente, cantidad } = request.body;
   
    const newItem = { ingrediente, cantidad,id:cont }
    console.log(newItem)
    list.push(newItem)
    cont++
    reply.redirect("add");

}
export  const list_router: FastifyPluginAsync  = async(app)=>{
    app.post("/form",form)
    app.get("/add",add)
}
~~~
- Añadimos método de borrado en `main_router`
~~~js
import { FastifyPluginAsync } from "fastify"
import { isReturnStatement } from "typescript"
import {list} from "./list.router"


const remove = (request: any, reply: any) => {
    const { id } = request.query
    console.log(id)
    let index = list.map((e:any)=>{
        return e.id
    }).indexOf(parseInt(id))
    list.splice(index,1)
    reply.redirect("/")
}

const home = (request: any, reply: any) => {
    const data = { title: "Your Shopping list", list };
    reply.view("views/index", data);
}
export const main_router:FastifyPluginAsync =async (app) => {
    app.get("/", home)
    app.get("/remove",remove)
}
~~~
# 11 Utilizamos `#with`de hadnlebars
- Modificamos el `index.hbs`
~~~html
<h1>{{title}}</h1>
<ul>
    {{#each list}}
        {{#with this}}
            <li>Productos: {{ ingrediente }}. Cantidad: {{ cantidad }} -  
            <a href="/remove?id={{id}}">Delete</a>
            </li>
        {{/with}}
   
    {{/each}}
</ul>

<a href="/list/add">Añadir</a>
{{#if list.length}} 
    <h2>Theres are {{list.length}} in the list</h2>
   <div>
       <h3>The most important is</h3>
        <li>Productos: {{ list.0.ingrediente }}. 
            Cantidad: {{ list.0.cantidad }}
            
        </li>
     
   </div>
{{/if}}
~~~
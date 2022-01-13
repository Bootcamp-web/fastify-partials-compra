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
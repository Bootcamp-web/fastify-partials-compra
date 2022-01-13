import { FastifyPluginAsync } from "fastify"
import {list} from "./list.router"


const home = (request: any, reply: any) => {
    const data = { title: "Your Shopping list", list };
    reply.view("views/index", data);
}
export const main_router:FastifyPluginAsync =async (app) => {
    app.get("/", home)
}


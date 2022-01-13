import { FastifyPluginAsync } from "fastify"



const home = (request: any, reply: any) => {
    const data = { title: "Your Shopping list" };
    reply.view("views/index", data);
}
export const main_router:FastifyPluginAsync =async (app) => {
    app.get("/", home)
}
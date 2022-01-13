import {FastifyPluginAsync} from "fastify"
import { request } from "http"

 
export let list= [
    {ingrediente:"Papas", cantidad:3 },
    {ingrediente:"Cebollas",cantidad:6},
]


const form = (request: any, reply:any)=>{
    
}
export  const list_router: FastifyPluginAsync  = async(app)=>{
    app.post("/",form)
}
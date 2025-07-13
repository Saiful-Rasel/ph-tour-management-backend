import { Router } from "express"
import { userRoutes } from "../../module/user/user.route"
import path from "path"

export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route:userRoutes
    }
    
]

moduleRoutes.forEach((route) => {
    router.use(route.path,route.route)
})
import dotenv from "dotenv"

dotenv.config()

 export const envVar = {
    port : process.env.PORT,
    db_url:process.env.DB_URL,
    node_env : process.env.NODE_ENV
}


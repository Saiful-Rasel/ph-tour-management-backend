import dotenv from "dotenv"

dotenv.config()

 export const envVar = {
    port : process.env.PORT,
    db_url:process.env.DB_URL,
    node_env : process.env.NODE_ENV,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIREDIN:process.env.JWT_EXPIREDIN,
    BCRYPT_SALT_ROUND:process.env.BCRYPT_SALT_ROUND,
    SUPER_ADMIN_EMAIL :process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD :process.env.SUPER_ADMIN_PASSWORD
}


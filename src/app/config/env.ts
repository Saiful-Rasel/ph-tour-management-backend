import dotenv from "dotenv"

dotenv.config()

 export const envVar = {
    port : process.env.PORT,
    db_url:process.env.DB_URL,
    node_env : process.env.NODE_ENV,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIREDIN:process.env.JWT_EXPIREDIN,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES as string,
    BCRYPT_SALT_ROUND:process.env.BCRYPT_SALT_ROUND,
    SUPER_ADMIN_EMAIL :process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD :process.env.SUPER_ADMIN_PASSWORD,
    EXPRESS_SESSION_SECRET:process.env.EXPRESS_SESSION_SECRET,
    FRONTEND_URL:process.env.FRONTEND_URL,
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID
}


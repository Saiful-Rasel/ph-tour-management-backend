import dotenv from "dotenv";

dotenv.config();

export const envVar = {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  node_env: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIREDIN: process.env.JWT_EXPIREDIN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  SSL: {
    SSL_STORE_ID: process.env.SSL_STORE_ID as string,
    SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
    SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
    SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
    SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,

    SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
    SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
    SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
  },
  cloudinary: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLUDINARY_SECRET_KEY: process.env.CLUDINARY_SECRET_KEY as string,
  },
  EMAIL_SENDER: {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PASS: process.env.SMTP_PASS,
  },
};

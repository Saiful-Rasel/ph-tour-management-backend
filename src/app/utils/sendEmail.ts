import nodemailder from "nodemailer";
import { envVar } from "../config/env";
import path, { dirname } from 'path'
import ejs from "ejs"
import AppError from "../errorHelper/Apperror";

const transporter = nodemailder.createTransport({
  host: envVar.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVar.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVar.EMAIL_SENDER.SMTP_USER,
    pass: envVar.EMAIL_SENDER.SMTP_PASS,
  },
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEamil = async ({
  to,
  subject,
  attachments,
  templateName,
  templateData,
}: sendEmailOptions) => {
   try {
     const templatePath = path.join(__dirname,`templates/${templateName}.ejs`) 
    const html = await ejs.renderFile(templatePath,templateData)
  const info = await transporter.sendMail({
    from: envVar.EMAIL_SENDER.SMTP_FROM,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments?.map((attachment) => ({
      fileName: attachment.fileName,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  });
   } catch (error:any) {
    console.log("email sending errror",error.message)
    throw new AppError(400,"email sending error")
   }
};

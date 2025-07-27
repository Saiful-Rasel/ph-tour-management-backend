import { v2 as cloudinary} from "cloudinary";
import { envVar } from "./env";
import AppError from "../errorHelper/Apperror";

cloudinary.config({
    api_key:envVar.cloudinary.CLOUDINARY_API_KEY,
    cloud_name:envVar.cloudinary.CLOUDINARY_CLOUD_NAME,
    api_secret:envVar.cloudinary.CLUDINARY_SECRET_KEY
})

export const deleteImageFromCloudinary = async(imageUrl :string) =>{
try {
    const regex =/\v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i
const match =imageUrl.match(regex);
if(match && match[1]){
    const public_id = match[1]
    await cloudinary.uploader.destroy(public_id)
    console.log(`file${public_id}is deleted`)
}
} catch (error:any) {
    throw new AppError(401,"cloudinary image deletion failed",error.message)
}
}

export const cloudinaryUpload = cloudinary
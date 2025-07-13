import { model, SchemaType } from "mongoose";
import { Schema } from "mongoose";
import { IauthProvider, isActive, Iuser, Role } from "./user.interface";

const authProviderSchema = new Schema<IauthProvider>({
    provider:{type:String,required:true},
    providerId : {type:String,required:true}
},{
    versionKey:false,
    _id:false
})

const userSchema = new Schema<Iuser>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    role:{type:String,enum:Object.values(Role),default:Role.USER},
    phone:{type:String},
    picture:{type:String},
    address:{type:String},
    isActive:{type:String,enum:Object.values(isActive), default:isActive.ACTIVE},
    isVerified:{type:Boolean,default:false},
    auths:[authProviderSchema],
 

},{
    timestamps:true,
    versionKey:false
})


export const User = model<Iuser>("User",userSchema)


import { Types } from "mongoose"

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export interface IauthProvider {
    provider : string,
    providerId : string
}
export enum isActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface Iuser {
    name:string,
    email:string,
    password?:string,
    phone?:string,
    picture?:string,
    address?:string,
    isDeleted?:string,
    isActive?:isActive,
    isVerified?:string,
    auths :  IauthProvider[],
    role: Role,
    bookings ?:Types.ObjectId[],
    guides ?: Types.ObjectId[]
}
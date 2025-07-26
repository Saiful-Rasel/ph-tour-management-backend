import { Types } from "mongoose";

export enum Booking_status{
    PENDING="PENDING",
    CANCEL="CANCEL",
    COMPLETE="COMPLETE",
    FAILED = "FAILED"
}

export interface Ibooking{
    user:Types.ObjectId,
    tour:Types.ObjectId,
    payment ?:Types.ObjectId,
    guestCount:number,
    status:Booking_status
}
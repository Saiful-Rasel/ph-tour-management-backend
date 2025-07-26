import { model,  Schema } from "mongoose";
import { Booking_status, Ibooking } from "./Booking.interface";

const bookingSchema = new Schema<Ibooking>({
    user:{type:Schema.Types.ObjectId ,ref:"User",required:true},
    tour:{type:Schema.Types.ObjectId ,ref:"Tour",required:true},
    payment:{type:Schema.Types.ObjectId ,ref:"Payment",},
    status:{type:String,enum:Object.values(Booking_status),default:Booking_status.PENDING},
    guestCount:{type:Number,required:true},


},{
    timestamps:true
})

export const Booking = model<Ibooking>("Booking",bookingSchema)
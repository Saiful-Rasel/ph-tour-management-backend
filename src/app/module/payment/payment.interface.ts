import { Types } from "mongoose";

export enum payment_status{
    PAID="PAID",
    UNPAID="UNPAID",
    CANCELD="CANCELD",
    FAILED="FAILED",
    REFUND="REFUND"
}

export interface Ipayment{
    booking:Types.ObjectId,
    transactionId:string,
    status:payment_status,
    amount:number,
    paymentGatewayData?:any,
    invoiceUrl?:string
}
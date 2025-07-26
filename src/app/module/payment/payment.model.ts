
import { Ipayment, payment_status } from "./payment.interface"
import { model, Schema } from "mongoose"


const paymentSchema = new Schema<Ipayment>({
   booking:{type:Schema.Types.ObjectId ,ref:"Booking",required:true,unique:true},
 transactionId:{type:String,required:true,unique:true},
    status:{type:String,enum:Object.values(payment_status),default:payment_status.UNPAID},
    amount:{type:Number,required:true},
    paymentGatewayData:{type:Schema.Types.Mixed},
    invoiceUrl:{type:String}

},{
    timestamps:true
})

export const Payment = model<Ipayment>("Payment",paymentSchema)
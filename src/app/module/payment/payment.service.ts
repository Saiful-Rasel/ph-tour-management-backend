/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errorHelper/Apperror";
import { Booking_status } from "../Booking/Booking.interface";
import { Booking } from "../Booking/Booking.model";
import { Isslcommerz } from "../sslCommerz/sslcommerz.interface";
import { sslService } from "../sslCommerz/sslcommerz.service";
import { payment_status } from "./payment.interface";
import { Payment } from "./payment.model";
import  httpStatus  from "http-status";
const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: Isslcommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await sslService.sslcommerzInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },

      { status: payment_status.PAID },
      { new: true, runValidators: true, session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      {
        status: Booking_status.COMPLETE,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "payment completed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },

      { status: payment_status.FAILED },
      { new: true, runValidators: true, session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      {
        status: Booking_status.FAILED,
      },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "payment failed " };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },

      { status: payment_status.CANCELD },
      { new: true, runValidators: true, session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      {
        status: Booking_status.CANCEL,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "payment canceld " };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Booking } from "./Booking.model";
import { Booking_status, Ibooking } from "./Booking.interface";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import AppError from "../../errorHelper/Apperror";
import httpStatus from "http-status";
import { payment_status } from "../payment/payment.interface";
import { sslService } from "../sslCommerz/sslcommerz.service";
import { Isslcommerz } from "../sslCommerz/sslcommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";



/**
 * Duplicate DB Collections / replica
 *
 * Relica DB -> [ Create Booking -> Create Payment ->  Update Booking -> Error] -> Real DB
 */

const createBooking = async (payload: Partial<Ibooking>, userId: string) => {
  const transactionId = getTransactionId();
 
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
      if (!user?.phone || !user?.address) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "please update your profile to create a Tour"
        );
      }

    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_GATEWAY, "no Tour Cost Found");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: Booking_status.PENDING,
          ...payload,
        },
      ],
      { session }
    );
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: payment_status.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

      const userAddress = (updatedBooking?.user as any).address 
      const userPhone = (updatedBooking?.user as any).phone 
      const userEmail = (updatedBooking?.user as any).email 
      const userName = (updatedBooking?.user as any).name 

      const sslPayload :Isslcommerz = {
        address:userAddress,
        phoneNumber:userPhone,
        email:userEmail,
        name:userName,
        amount:amount,
        transactionId:transactionId
      }
 
      const sslPayment = await sslService.sslcommerzInit(sslPayload)
       

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      booking:updatedBooking,
      paymentUrl:sslPayment.GatewayPageURL
    };
  } catch (error) {
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};

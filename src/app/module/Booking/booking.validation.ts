import { z } from "zod";
import { Booking_status } from "./Booking.interface";


export const createBookingZodSchema = z.object({
    tour: z.string(),
    guestCount: z.number().int().positive()

});

export const updateBookingStatusZodSchema = z.object({
    status: z.enum(Object.values(Booking_status) as [string]),
});
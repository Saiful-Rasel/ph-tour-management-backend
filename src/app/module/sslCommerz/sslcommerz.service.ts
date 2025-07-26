import axios, { HttpStatusCode } from "axios";
import { envVar } from "../../config/env";
import { Isslcommerz } from "./sslcommerz.interface";
import AppError from "../../errorHelper/Apperror";

const sslcommerzInit = async (payload: Isslcommerz) => {
  
  try {
    const data = {
      store_id: envVar.SSL.SSL_STORE_ID,
      store_passwd: envVar.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVar.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVar.SSL.SSL_FAIL_BACKEND_URL}?transactionId =${payload.transactionId}&amount=${payload.amount}&status=FAIL`,
      cancel_url: `${envVar.SSL.SSL_CANCEL_BACKEND_URL}?transactionId =${payload.transactionId}&amount=${payload.amount}&status=CANCEL`,
      // ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVar.SSL.SSL_PAYMENT_API,
      data: data,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(HttpStatusCode.BadRequest, error);
  }
};

export const sslService = {
  sslcommerzInit,
};

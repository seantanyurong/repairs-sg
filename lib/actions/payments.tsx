'use server';

import Payment from "@/models/Payment";

const getPayment = async (paymentId: string) => {
  return Payment.findById(paymentId);
};

const getPayments = async () => {
  return Payment
  .find()
    .sort({ paymentDate: -1 })
    .limit(20);
};

export { getPayment, getPayments };
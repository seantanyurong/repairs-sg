'use server';

import Payment from "@/models/Payment";

const getPayments = async () => {
  return Payment
  .find()
    .sort({ paymentDate: -1 })
    .limit(20);
};

export { getPayments };
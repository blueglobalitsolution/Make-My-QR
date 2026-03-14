import client from './client';

export const createOrder = async (planId: number) => {
    const response = await client.post('/api/payments/create-order/', { plan_id: planId });
    return response.data;
};

export const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) => {
    const response = await client.post('/api/payments/verify-payment/', paymentData);
    return response.data;
};

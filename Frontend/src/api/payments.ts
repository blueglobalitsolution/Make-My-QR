import client from './client';

const CURRENCY_KEY = 'mmyq_currency';

/** Currency explicitly picked by the visitor ("" = let the server decide by country). */
export const getSavedCurrency = (): string => {
    try {
        return localStorage.getItem(CURRENCY_KEY) || '';
    } catch {
        return '';
    }
};

export const setSavedCurrency = (code: string): void => {
    try {
        if (code) localStorage.setItem(CURRENCY_KEY, code);
        else localStorage.removeItem(CURRENCY_KEY);
    } catch {
        /* storage blocked - the in-memory state still works */
    }
};

export const createOrder = async (planId: number) => {
    const response = await client.post('/payments/create-order/', { plan_id: planId });
    return response.data;
};

export const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) => {
    const response = await client.post('/payments/verify-payment/', paymentData);
    return response.data;
};
export const getPlans = async (currency?: string) => {
    const response = await client.get('/payments/plans/', {
        params: currency ? { currency } : undefined,
    });
    return response.data;
};

export const getPricingMeta = async (currency?: string) => {
    const response = await client.get('/payments/pricing/', {
        params: currency ? { currency } : undefined,
    });
    return response.data;
};

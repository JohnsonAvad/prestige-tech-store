import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV !== 'test') {
    console.warn(`[config] Warning: ${name} is not set in your .env file`);
  }
  return value;
}

const config = {
  port: process.env.PORT || 3000,

  momo: {
    env: process.env.MOMO_ENV || 'sandbox',
    baseUrl: required('MOMO_BASE_URL'),
    subscriptionKey: required('MOMO_SUBSCRIPTION_KEY'),
    apiUser: required('MOMO_API_USER'),
    apiKey: required('MOMO_API_KEY'),
    targetEnvironment: process.env.MOMO_TARGET_ENVIRONMENT || 'sandbox',
    callbackUrl: process.env.MOMO_CALLBACK_URL,
  },

  airtel: {
    env: process.env.AIRTEL_ENV || 'staging',
    baseUrl: required('AIRTEL_BASE_URL'),
    clientId: required('AIRTEL_CLIENT_ID'),
    clientSecret: required('AIRTEL_CLIENT_SECRET'),
    country: process.env.AIRTEL_COUNTRY || 'UG',
    currency: process.env.AIRTEL_CURRENCY || 'UGX',
    callbackUrl: process.env.AIRTEL_CALLBACK_URL,
  },
};

export default config;
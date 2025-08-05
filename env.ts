// env.ts
import Constants from "expo-constants";

const extra = (Constants.expoConfig || {}).extra || {};

export const BASE_URL = extra.BASE_URL as string;
export const RAZORPAY_KEY_ID = extra.RAZORPAY_KEY_ID as string;
export const GOOGLE_API_KEY = extra.GOOGLE_API_KEY as string;

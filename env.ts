// env.ts
import Constants from "expo-constants";

const extra = (Constants.expoConfig || {}).extra || {};

export const BASE_URL = extra.BASE_URL as string;
export const RAZORPAY_KEY_ID = extra.RAZORPAY_KEY_ID as string;
export const GOOGLE_API_KEY = extra.GOOGLE_API_KEY as string;
export const GOOGLE_CLIENT_ID = extra.GOOGLE_CLIENT_ID as string;
export const GOOGLE_ANDROID_ID = extra.GOOGLE_ANDROID_ID as string;
export const GOOGLE_APPLE_ID = extra.GOOGLE_APPLE_ID as string;

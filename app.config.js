// app.config.js
import "dotenv/config";

export default ({ config }) => ({
    ...config,

    extra: {
        ...config.extra,
        BASE_URL: process.env.BASE_URL,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },

    android: {
        ...config.android,
        config: {
            ...config.android.config,
            googleMaps: {
                apiKey: process.env.GOOGLE_API_KEY,
            },
        },
    },

    ios: {
        ...config.ios,
    },
});

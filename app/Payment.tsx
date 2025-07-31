import { Alert } from "react-native"
import axios from "axios"
import { BASE_URL } from "@env"
interface PaymentOptions {
    amount: number
    callback?: () => void
    userDetails?: {
        name?: string
        email?: string
        contact?: string
    }
    description?: string
    themeColor?: string
}

export const handlePayment = async ({
    amount,
    callback,
    userDetails = {
        name: "Default User",
        email: "default@example.com",
        contact: "0000000000",
    },
    description = "Test Transaction",
    themeColor = "#3399cc",
}: PaymentOptions) => {

    try {
        // Create order on backend - exactly like website
        const order = await axios.post(`${BASE_URL}/api/create-order`, { amount }) as any;

        // For React Native/Expo - Simple implementation for now
        Alert.alert("Payment Required", `Amount: ₹${amount.toLocaleString()}\nDescription: ${description}`, [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Pay Now",
                onPress: async () => {
                    try {
                        // Mock payment response for testing
                        const mockPaymentResponse = {
                            razorpay_payment_id: `pay_${Date.now()}`,
                            razorpay_order_id: order.data.id,
                            razorpay_signature: `signature_${Date.now()}`,
                        }

                        // Verify payment on backend - exactly like website
                        await axios.post(`${BASE_URL}/api/verify-payment`, {
                            paymentId: mockPaymentResponse.razorpay_payment_id,
                            orderId: mockPaymentResponse.razorpay_order_id,
                            signature: mockPaymentResponse.razorpay_signature,
                        })

                        Alert.alert("Success", "Payment successful!")

                        if (callback) {
                            callback()
                        }
                    } catch (verificationError) {
                        console.error("Payment verification error:", verificationError)
                        Alert.alert("Error", "Payment verification failed")
                    }
                },
            },
        ])
    } catch (error) {
        console.error("Payment error:", error)
        Alert.alert("Error", "Payment failed. Please try again.")
    }
}

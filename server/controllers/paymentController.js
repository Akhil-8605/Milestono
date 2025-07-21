const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  try {
      const options = {
          amount: amount * 100,
          currency: 'INR',
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating RazorPay order');
  }
};

exports.verifyPayment = (req, res) => {
  const { paymentId, orderId, signature } = req.body;
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (generatedSignature === signature) {
    res.send('Payment verified successfully');
  } else {
    res.status(400).send('Invalid signature');
  }
};

const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Check razorpay connection
router.get("/connection-check", async (req, res) => {
  try {
    razorpay.customers.all({ count: 1 }, (error, customers) => {
      if (error) {
        console.error("Razorpay connection error:", error);
        return res
          .status(500)
          .json({ message: "Error connecting to Razorpay" });
      }
      return res.status(200).json({ message: "Connected to Razorpay" });
    });
  } catch (error) {
    console.error("Error during Razorpay connection check:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET transaction history
router.get('/history', async (req, res) => {
  try {
    razorpay.payments.all({ count: 10 }, (error, payments) => {
      if (error) {
        console.error('Error fetching transaction history:', error);
        return res.status(500).json({ message: 'Error fetching transaction history' });
      }
      return res.status(200).json({ data: payments.items });
    });
  } catch (error) {
    console.error('Error during transaction history retrieval:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    razorpay.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

// GET order details
router.get('/order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    razorpay.orders.fetch(orderId, (error, order) => {
      if (error) {
        console.error('Error fetching order details:', error);
        return res.status(500).json({ message: 'Error fetching order details' });
      }
      return res.status(200).json({ data: order });
    });
  } catch (error) {
    console.error('Error during order details retrieval:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

module.exports = router;

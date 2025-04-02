import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Payment Route
app.post("/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency, paymentMethod } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to smallest currency unit
        currency: currency || "inr", // INR for UPI
        payment_method_types: ["card", "upi"], // Add UPI support
      });
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
app.listen(5000, () => console.log("Server running on port 5000"));

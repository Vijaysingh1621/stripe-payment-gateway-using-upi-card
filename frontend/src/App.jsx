import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentRequestButtonElement, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51R9Vl603caHNnObXEjNyN7BX076Xoved7NzT2U42f7hoEMSiMMA1jc8XOhDETNZOT4tkhNmjrP35mFr5ffIO7dCz00YAXDPGy9");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default: Card

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create Payment Intent
    const { data } = await axios.post("http://localhost:5000/create-payment-intent", {
      amount: 500, // ₹5.00 (UPI supports INR only)
      currency: "inr",
      paymentMethod,
    });

    const clientSecret = data.clientSecret;

    // Confirm Payment
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:3000/success" }, // Redirect on success
    });

    setLoading(false);
    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Payment Successful!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Complete Your Payment</h2>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Choose Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        {/* Card Input */}
        {paymentMethod === "card" && (
          <div className="border border-gray-300 p-3 rounded-md mb-4">
            <CardElement className="p-2" />
          </div>
        )}

        {/* UPI Placeholder (Stripe auto-generates UPI QR code / ID) */}
        {paymentMethod === "upi" && (
          <div className="border border-gray-300 p-3 rounded-md mb-4 text-center">
            <p className="text-gray-700">You will be redirected to your UPI app.</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-bold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Payment;

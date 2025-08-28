import React, { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import LoadingSpinner from '../shared/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size={20} color="#ffffff" />
              <span className="ml-2">Sending...</span>
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
};



export default ForgotPassword; 
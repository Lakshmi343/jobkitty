import React, { useState } from 'react';
import axios from 'axios';
import { CONTACT_API_END_POINT } from '../utils/constant';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Mail, MapPin, Phone, Send, CheckCircle, UserCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  
  const email = "jobkittyteam@gmail.com";
 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${CONTACT_API_END_POINT}/submit`, formData);
      const result = await response.data;

      if (result.success) {
        toast.success(result.message || 'Message sent successfully!');
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
   
      <div >

      {/* Popup Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center">
                <UserCircle className="w-20 h-20 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Contact Info</h3>
                <p className="text-gray-600 mb-6">Reach us directly via phone or email</p>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-2">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-3 drop-shadow-lg">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              We'd love to hear from you. Please reach out with any questions or feedback.
            </p>
          </div>

          {/* Extra Button for Modal */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
            >
              View Contact Info
            </button>
          </div>

          {/* Contact Form */}
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100 backdrop-blur-md transition-all duration-300 hover:shadow-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Send us a Message</h2>
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back soon.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition-all duration-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 text-gray-900 font-medium shadow-sm transition-all duration-200"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 text-gray-900 font-medium shadow-sm transition-all duration-200"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject *"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 text-gray-900 font-medium shadow-sm transition-all duration-200"
                  required
                />
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 text-gray-900 font-medium shadow-sm resize-none transition-all duration-200"
                  required
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-300 disabled:to-purple-300 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 text-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

     
      </div>
    </>
  );
};

export default Contact;













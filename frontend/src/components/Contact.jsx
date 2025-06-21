import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Mail, MapPin, Phone, Clock, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const address = "306, 3rd Floor, Penta Towers, Bus Stand, Banerji Rd, opposite Kaloor, Kaloor, Kochi, Ernakulam, Kerala 682017";
  const email = "righthuman.rhr@gmail.com";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email using backend API
      const response = await fetch('http://localhost:8000/api/v1/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Message sent successfully! We will get back to you soon.');
        setIsSubmitted(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(result.message || 'Failed to send message. Please try again.');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Please reach out with any questions, feedback, or inquiries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4 group cursor-pointer" onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, '_blank')}>
                    <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-200">
                      <MapPin className="text-blue-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Address</h3>
                      <p className="text-gray-600 leading-relaxed">{address}</p>
                      <p className="text-blue-600 text-sm mt-1 group-hover:underline">Click to open in maps</p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start space-x-4 group cursor-pointer" onClick={() => window.open(`mailto:${email}`, '_blank')}>
                    <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-200">
                      <Mail className="text-green-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                      <p className="text-gray-600">{email}</p>
                      <p className="text-green-600 text-sm mt-1 group-hover:underline">Click to send email</p>
                    </div>
                  </div>
                  
                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Clock className="text-purple-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:30 PM</p>
                      <p className="text-gray-600">2nd & 4th Saturday will be close, other Saturdays: 9:00 AM - 2:30 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-4">Thank you for contacting us. We will get back to you soon.</p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name *"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email *"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder="Your Message *"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
                <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Location"
                    className="rounded-xl"
                  ></iframe>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Professional job matching services</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Verified employers and job listings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Career guidance and resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact; 
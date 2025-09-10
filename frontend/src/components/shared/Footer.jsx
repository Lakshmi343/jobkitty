import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, ArrowUp, ExternalLink } from 'lucide-react';
import logo from "../../assets/jobkitty-01.png"

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmailClick = () => {
    window.open('mailto:jobkitty.in@gmail.com', '_blank');
  };

  const handlePhoneClick = (number) => {
    window.open(`tel:${number}`, '_blank');
  };

  const handleAddressClick = () => {
    const address = "306, 3rd Floor, Penta Towers, Bus Stand, Banerji Rd, opposite Kaloor, Kaloor, Kochi, Ernakulam, Kerala 682017";
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo + About */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 group">
              <img src={logo} alt="logo" style={{width:"150px"}} />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering your career journey. Find your dream job or the perfect candidate with us! 
              We connect talented professionals with innovative companies across India.
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div 
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={handleEmailClick}
              >
                <div className="bg-[#6A38C2] p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    jobkitty.in@gmail.com
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>

              {/* Phone 1 */}
              <div 
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => handlePhoneClick("9633019801")}
              >
                <div className="bg-[#6A38C2] p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    +91 96330 19801
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>

              {/* Phone 2 */}
              <div 
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => handlePhoneClick("9746498640")}
              >
                <div className="bg-[#6A38C2] p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    +91 97464 98640
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white relative">
              Services
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded"></div>
            </h3>
            <ul className="space-y-3">
              {[
                'Job Search',
                'Resume Builder', 
                'Career Advice',
                'Company Reviews',
                'Recruiter Dashboard',
                'Interview Prep'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                      isHovered === index ? 'bg-[#F83002] scale-150' : 'bg-gray-500'
                    }`}></span>
                    {service}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#F83002] to-[#6A38C2] rounded"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Jobs', path: '/jobs' },
                { name: 'Browse', path: '/browse' },
                { name: 'Contact', path: '/contact' },
                { name: 'Login', path: '/login' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    onMouseEnter={() => setIsHovered(index + 10)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                      isHovered === index + 10 ? 'bg-[#6A38C2] scale-150' : 'bg-gray-500'
                    }`}></span>
                    {link.name}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm">
            © 2025 JobKitty. All rights reserved.
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              className="p-2 bg-white/10 rounded-full hover:bg-[#1877f3] transition-all duration-300 transform hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
              </svg>
            </a>
            {/* Twitter */}
            <a 
              href="https://twitter.com" 
              className="p-2 bg-white/10 rounded-full hover:bg-[#1da1f2] transition-all duration-300 transform hover:scale-110"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              className="p-2 bg-white/10 rounded-full hover:bg-[#0077b5] transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-[#6A38C2] to-[#F83002] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;

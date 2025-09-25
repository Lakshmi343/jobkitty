// import React, { useState } from 'react';
// import { Mail, MapPin, Phone, Clock, ArrowUp, ExternalLink } from 'lucide-react';
// import logo from "../../assets/jobkitty-01.png"

// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);
//   const [isHovered, setIsHovered] = useState(null);

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (email) {
//       setSubscribed(true);
//       setEmail("");
//       setTimeout(() => setSubscribed(false), 3000);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleEmailClick = () => {
//     window.open('mailto:jobkitty.in@gmail.com', '_blank');
//   };

//   const handlePhoneClick = (number) => {
//     window.open(`tel:${number}`, '_blank');
//   };

//   const handleAddressClick = () => {
//     const address = "306, 3rd Floor, Penta Towers, Bus Stand, Banerji Rd, opposite Kaloor, Kaloor, Kochi, Ernakulam, Kerala 682017";
//     const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
//     window.open(mapUrl, '_blank');
//   };

//   return (
//     <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">

//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
//         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
//       </div>

//       <div className="container mx-auto px-4 py-12 relative z-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

         
//           <div className="lg:col-span-2">
//             <div className="flex items-center mb-6 group">
//               <img src={logo} alt="logo" style={{width:"150px"}} />
//             </div>
//             <p className="text-gray-300 mb-6 leading-relaxed">
//               Empowering your career journey. Find your dream job or the perfect candidate with us! 
//               We connect talented professionals with innovative companies across Kerala.
//             </p>

//             <div className="space-y-4">
//               jobkitty.in@gmail.com
//               <div 
//                 className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group"
//                 onClick={handleEmailClick}
//               >
//                 <div className="bg-[#6A38C2] p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
//                   <Mail className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
//                     jobkitty.in@gmail.com
//                   </p>
//                 </div>
//                 <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
//               </div>

              

              
//             </div>
//           </div>

//           {/* Services Section */}
//           <div>
//             <h3 className="text-xl font-semibold mb-6 text-white relative">
//               Services
//               <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded"></div>
//             </h3>
//             <ul className="space-y-3">
//               {[
//                 'Job Search',
//                 'Resume Builder', 
//                 'Career Advice',
//                 'Company Reviews',
//                 'Recruiter Dashboard',
//                 'Interview Prep'
//               ].map((service, index) => (
//                 <li key={index}>
//                   <a 
//                     href="#" 
//                     className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
//                     onMouseEnter={() => setIsHovered(index)}
//                     onMouseLeave={() => setIsHovered(null)}
//                   >
//                     <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
//                       isHovered === index ? 'bg-[#F83002] scale-150' : 'bg-gray-500'
//                     }`}></span>
//                     {service}
//                     <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

          
//           <div>
//             <h3 className="text-xl font-semibold mb-6 text-white relative">
//               Quick Links
//               <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#F83002] to-[#6A38C2] rounded"></div>
//             </h3>
//             <ul className="space-y-3">
//               {[
//                 { name: 'Home', path: '/' },
//                 { name: 'Jobs', path: '/jobs' },
//                 { name: 'Browse', path: '/browse' },
//                 { name: 'Contact', path: '/contact' },
//                 { name: 'Login', path: '/login' }
//               ].map((link, index) => (
//                 <li key={index}>
//                   <a 
//                     href={link.path}
//                     className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
//                     onMouseEnter={() => setIsHovered(index + 10)}
//                     onMouseLeave={() => setIsHovered(null)}
//                   >
//                     <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
//                       isHovered === index + 10 ? 'bg-[#6A38C2] scale-150' : 'bg-gray-500'
//                     }`}></span>
//                     {link.name}
//                     <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

        
//         <div className="mt-8 pt-8 border-t border-white/20 flex flex-col items-center justify-center space-y-4">
//           <div className="text-gray-400 text-sm">
//             © 2025 JobKitty. All rights reserved.
//           </div>

    
//           <div className="flex items-center justify-center space-x-4">
          
          
           
            
           
//           </div>
//         </div>

       
//         <button 
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-[#6A38C2] to-[#F83002] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
//           aria-label="Back to top"
//         >
//           <ArrowUp className="w-6 h-6" />
//         </button>
//       </div>
//     </footer>
//   );
// }

// export default Footer;

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, ArrowUp, ExternalLink } from 'lucide-react';
import logo from "../../assets/jobkitty-01.png";

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

          {/* Logo & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 group">
              <img src={logo} alt="JobKitty Logo" style={{width:"150px"}} />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering your career journey. Find your dream job or the perfect candidate with us! 
              We connect talented professionals with innovative companies across Kerala.
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div 
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                onClick={handleEmailClick}
              >
                <div className="bg-[#6A38C2] p-2 rounded-full">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 hover:text-white transition-colors">
                    jobkitty.in@gmail.com
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </div>

              {/* Phone */}
              <div 
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => handlePhoneClick("+918123456789")}
              >
                <div className="bg-[#F83002] p-2 rounded-full">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 hover:text-white transition-colors">
                    +91 8123456789
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </div>

              {/* Address */}
              <div 
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                onClick={handleAddressClick}
              >
                <div className="bg-[#6A38C2] p-2 rounded-full">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 hover:text-white transition-colors">
                    306, 3rd Floor, Penta Towers, Kochi
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </div>

              {/* Subscribe */}
              <form onSubmit={handleSubscribe} className="mt-4 flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 p-2 rounded-l-lg border-none outline-none text-gray-900"
                  required
                />
                <button type="submit" className="bg-[#6A38C2] px-4 rounded-r-lg hover:bg-[#F83002] transition-colors">
                  Subscribe
                </button>
              </form>
              {subscribed && <p className="text-green-400 mt-2">Subscribed successfully!</p>}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white relative">
              Services
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded"></div>
            </h3>
            <ul className="space-y-3">
              {[
                'Job Search', 'Resume Builder', 'Career Advice',
                'Company Reviews', 'Recruiter Dashboard', 'Interview Prep'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
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

          {/* Quick Links */}
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
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
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
        <div className="mt-8 pt-8 border-t border-white/20 flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400 text-sm">
            © 2025 JobKitty. All rights reserved.
          </div>
        </div>

        {/* Scroll to Top */}
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
};

export default Footer;

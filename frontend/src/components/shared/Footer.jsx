
// import React, { useState } from 'react';
// import { Mail, MapPin, Phone, Clock, ArrowUp, ExternalLink } from 'lucide-react';
// import logo from "../../assets/jobkitty-01.png";

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
//     window.open('mailto:jobkittyteam@gmail.com', '_blank');
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
//               <img src={logo} alt="JobKitty Logo" style={{width:"150px"}} />
//             </div>
//             <p className="text-gray-300 mb-6 leading-relaxed">
//               Empowering your career journey. Find your dream job or the perfect candidate with us! 
//               We connect talented professionals with innovative companies across Kerala.
//             </p>

//             <div className="space-y-4">
           
//               <div 
//                 className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
//                 onClick={handleEmailClick}
//               >
//                 <div className="bg-[#6A38C2] p-2 rounded-full">
//                   <Mail className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-300 hover:text-white transition-colors">
//                     jobkittyteam@gmail.com
//                   </p>
//                 </div>
//                 <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
//               </div>


//               <form onSubmit={handleSubscribe} className="mt-4 flex">
//                 <input 
//                   type="email" 
//                   placeholder="Enter your email" 
//                   value={email} 
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="flex-1 p-2 rounded-l-lg border-none outline-none text-gray-900"
//                   required
//                 />
//                 <button type="submit" className="bg-[#6A38C2] px-4 rounded-r-lg hover:bg-[#F83002] transition-colors">
//                   Subscribe
//                 </button>
//               </form>
//               {subscribed && <p className="text-green-400 mt-2">Subscribed successfully!</p>}
//             </div>
//           </div>

        
//           <div>
//             <h3 className="text-xl font-semibold mb-6 text-white relative">
//               Services
//               <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded"></div>
//             </h3>
//             <ul className="space-y-3">
//               {[
//                 'Job Search', 'Resume Builder', 'Career Advice',
//                 'Company Reviews', 'Recruiter Dashboard', 'Interview Prep'
//               ].map((service, index) => (
//                 <li key={index}>
//                   <a 
//                     href="#" 
//                     className="text-gray-300 hover:text-white transition-colors flex items-center group"
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
//                     className="text-gray-300 hover:text-white transition-colors flex items-center group"
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
// };

// export default Footer;
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, ArrowUp, ExternalLink, Facebook, Instagram, Linkedin, Twitter, Youtube, Send, MessageSquare } from 'lucide-react';
import logo from "../../assets/jobkitty_xmass.png";

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

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* LOGO + EMAIL + SUBSCRIBE */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 group">
              <img src={logo} alt="JobKitty Logo" style={{ width: "150px" }} />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering your career journey. Find your dream job or the perfect candidate with us! 
              We connect talented professionals with innovative companies across Kerala.
            </p>

            <div className="space-y-4">

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

          {/* SERVICES */}
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

          {/* QUICK LINKS */}
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

        {/* ⭐ SOCIAL MEDIA SECTION (NEW) ⭐ */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">

          {/* WhatsApp */}
          <a href="https://whatsapp.com/channel/0029Vb6QVpSG8l5K4gZRoU3U" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <MessageSquare className="w-5 h-5" /> <span>WhatsApp</span>
          </a>

          {/* Facebook */}
          <a href="https://www.facebook.com/profile.php?id=61580790981145" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <Facebook className="w-5 h-5" /> <span>Facebook</span>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/jobkitty_official?igsh=MW5lNmtid20wZm1qMw==" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <Instagram className="w-5 h-5" /> <span>Instagram</span>
          </a>

          {/* Telegram */}
          <a href="https://t.me/jobkitty_in" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <Send className="w-5 h-5" /> <span>Telegram</span>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/109610014/admin/dashboard/" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <Linkedin className="w-5 h-5" /> <span>LinkedIn</span>
          </a>

          {/* Twitter */}
          <a href="https://x.com/@Jobkitty_in" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <Twitter className="w-5 h-5" /> <span>Twitter</span>
          </a>

          {/* YouTube */}
          <a href="https://www.youtube.com/@jobkitty_in" target="_blank" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <Youtube className="w-5 h-5" /> <span>YouTube</span>
          </a>

        </div>

        <div className="mt-8 pt-8 border-t border-white/20 flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400 text-sm">
            © 2025 JobKitty. All rights reserved.
          </div>
        </div>

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

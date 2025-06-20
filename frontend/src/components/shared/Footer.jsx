import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-t from-gray-100 to-white border-t border-t-gray-200 pt-10 pb-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* About */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-[#6A38C2]">Job<span className="text-[#F83002]">Portal</span></h2>
            <p className="text-gray-600 mb-3">Empowering your career journey. Find your dream job or the perfect candidate with us!</p>
            <p className="text-gray-600">Address: 306, 3rd Floor, Penta Towers, Bus Stand, Banerji Rd, opposite Kaloor, Kaloor, Kochi, Ernakulam, Kerala 682017</p>
            <div className="flex justify-center md:justify-start space-x-3 mt-4">
              <a href="https://facebook.com" className="hover:text-[#1877f3] transition-transform transform hover:scale-125" aria-label="Facebook"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" /></svg></a>
              <a href="https://twitter.com" className="hover:text-[#1da1f2] transition-transform transform hover:scale-125" aria-label="Twitter"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" /></svg></a>
              <a href="https://linkedin.com" className="hover:text-[#0077b5] transition-transform transform hover:scale-125" aria-label="LinkedIn"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" /></svg></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-2">Services</h3>
            <ul className="space-y-1 text-gray-600">
              <li>Job Search</li>
              <li>Resume Builder</li>
              <li>Career Advice</li>
              <li>Company Reviews</li>
              <li>Recruiter Dashboard</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-[#F83002] transition-colors">Home</a></li>
              <li><a href="/jobs" className="hover:text-[#F83002] transition-colors">Jobs</a></li>
              <li><a href="/browse" className="hover:text-[#F83002] transition-colors">Browse</a></li>
              <li><a href="/contact" className="hover:text-[#F83002] transition-colors">Contact</a></li>
              <li><a href="/login" className="hover:text-[#F83002] transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-2">Newsletter</h3>
            <p className="text-gray-600 mb-2">Get the latest job updates and career tips.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 items-center sm:items-stretch">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#F83002] w-full sm:w-auto"
                required
              />
              <button type="submit" className="bg-[#F83002] text-white px-4 py-2 rounded hover:bg-[#c82306] transition-colors">Subscribe</button>
            </form>
            {subscribed && <div className="text-green-600 mt-2">Thank you for subscribing!</div>}
          </div>
        </div>
        <div className="mt-8 border-t pt-4 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <div>© 2024 JobPortal. All rights reserved.</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="mailto:righthuman.rhr@gmail.com" className="hover:text-[#F83002] underline">righthuman.rhr@gmail.com</a>
            <span>|</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#F83002] underline">Back to Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
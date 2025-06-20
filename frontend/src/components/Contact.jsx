import React from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const address = "306, 3rd Floor, Penta Towers, Bus Stand, Banerji Rd, opposite Kaloor, Kaloor, Kochi, Ernakulam, Kerala 682017";
  const email = "righthuman.rhr@gmail.com";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-lg text-gray-600 text-center mb-12">We'd love to hear from you. Please reach out with any questions or feedback.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-[#F83002] p-3 rounded-full">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Our Address</h3>
                <p className="text-gray-600">{address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-[#F83002] p-3 rounded-full">
                <Mail className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={mapSrc}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact; 
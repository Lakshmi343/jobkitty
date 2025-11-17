import React from 'react';
import { Building2, Users, Award, TrendingUp } from 'lucide-react';

const ClientShowcase = () => {
    const clients = [
        "VI Point Solutions Pvt. Ltd.",
        "Poornam Infivision",
        "Allen Technologies",
        "Explore IT Solutions",
        "Acube Innovations Pvt. Ltd.",
        "Nagarjuna Herbal Consentrates Ltd",
        "Sai Services Pvt. Ltd.",
        "Tech Element",
        "Webdura Technologies",
        "Perfect Hand Solutions Pvt. Ltd",
        "J4Web",
        "ESR Masters Pvt. Ltd.",
        "Global Education Consultants",
        "Cyber Solutions",
        "Marvel Tours Pvt. Ltd",
        "Mankailash Sales & Marketing Pvt. Ltd.",
        "Ibyte Solutions",
        "Matglober Careers Pvt. Ltd.",
        "Web Info Softwares",
        "Phenomtec Solutions Pvt. Ltd.",
        "Sunny Diamonds",
        "Guidance Plus Educational Services",
        "Sectorcube Technolabs Pvt. Ltd.",
        "Alantech Industrial Solutions",
        "Bitdle Integrated Technologies Pvt. Ltd.",
        "ShellSquare Software Pvt. Ltd"
      ];
      

  // Split clients into two rows for better animation
  const firstRow = clients.slice(0, 13);
  const secondRow = clients.slice(13);

  return (
    <section className="py-16 bg-gradient-to-br from-white-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Trusted Clients
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're proud to partner with leading companies across various industries, 
            helping them find exceptional talent and build successful teams.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">4000+</span>
              </div>
              <p className="text-gray-600 text-sm">Trusted Partners</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">3000+</span>
              </div>
              <p className="text-gray-600 text-sm">Successful Placements</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">95%</span>
              </div>
              <p className="text-gray-600 text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Animated Client Logos */}
        <div className="relative">
          {/* First Row - Left to Right */}
          <div className="flex animate-scroll-left mb-6">
            <div className="flex gap-8 whitespace-nowrap">
              {[...firstRow, ...firstRow].map((client, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm md:text-base">
                      {client}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="flex animate-scroll-right">
            <div className="flex gap-8 whitespace-nowrap">
              {[...secondRow, ...secondRow].map((client, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm md:text-base">
                      {client}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none z-10"></div>
        </div>

       
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientShowcase;

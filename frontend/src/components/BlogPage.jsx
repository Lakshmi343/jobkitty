import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

const BlogPage = () => {

  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookmarked, setBookmarked] = useState([]);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const mockBlogs = [
          {
            id: 1,
            title: "How to Write a Resume That Gets You Hired",
            excerpt: "Learn the secrets to crafting a resume that stands out from the competition.",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "career-tips",
            date: "May 15, 2023",
            featured: true,
            readTime: "5 min read",
            likes: 42,
            comments: 8
          },
          {
            id: 2,
            title: "Top 10 In-Demand Tech Skills for 2023",
            excerpt: "Discover which technical skills employers are looking for this year.",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "technology",
            date: "April 28, 2023",
            featured: true,
            readTime: "7 min read",
            likes: 89,
            comments: 15
          },
          {
            id: 3,
            title: "Navigating Salary Negotiations Like a Pro",
            excerpt: "Strategies to help you get the compensation you deserve.",
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "career-tips",
            date: "April 15, 2023",
            featured: false,
            readTime: "6 min read",
            likes: 36,
            comments: 5
          },
          {
            id: 4,
            title: "Remote Work: Best Practices for Productivity",
            excerpt: "How to stay productive and maintain work-life balance when working remotely.",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "workplace",
            date: "March 30, 2023",
            featured: false,
            readTime: "8 min read",
            likes: 54,
            comments: 12
          },
          {
            id: 5,
            title: "Building Your Personal Brand for Career Success",
            excerpt: "Why personal branding matters and how to develop yours.",
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "career-tips",
            date: "March 22, 2023",
            featured: false,
            readTime: "4 min read",
            likes: 28,
            comments: 3
          },
          {

            id: 6,
            title: "The Future of Work: Trends to Watch",
            excerpt: "How emerging technologies are shaping the workplace of tomorrow.",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "workplace",
            date: "March 10, 2023",
            featured: false,
            readTime: "9 min read",
            likes: 67,
            comments: 9

          },
          {

            id: 7,
            title: "Behavioral Interview Questions: How to Prepare",
            excerpt: "Master the STAR method to ace your next behavioral interview.",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "interviewing",
            date: "February 28, 2023",
            featured: false,
            readTime: "6 min read",
            likes: 45,
            comments: 7

          },
          {

            id: 8,
            title: "AI in Hiring: What Candidates Should Know",
            excerpt: "How artificial intelligence is changing recruitment processes.",
            image: "https://plus.unsplash.com/premium_photo-1678566153919-86c4ba4216f1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            category: "technology",
            date: "February 15, 2023",
            featured: false,
            readTime: "7 min read",
            likes: 72,
            comments: 14

          }
        ];

        const mockCategories = [
          { id: 'all', name: 'All Topics', icon: '📚' },
          { id: 'career-tips', name: 'Career Tips', icon: '💼' },
          { id: 'technology', name: 'Technology', icon: '💻' },
          { id: 'workplace', name: 'Workplace', icon: '🏢' },
          { id: 'interviewing', name: 'Interviewing', icon: '🤝' },
        ];

        setBlogs(mockBlogs);
        setFeaturedBlogs(mockBlogs.filter(blog => blog.featured));
        setCategories(mockCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  useEffect(() => {
    if (featuredBlogs.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredBlogs.length]);

  const filteredBlogs = activeCategory === 'all' 
    ? blogs.filter(blog => !blog.featured && 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : blogs.filter(blog => blog.category === activeCategory && 
        !blog.featured && 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleBookmark = (id) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(blogId => blogId !== id));
    } else {
      setBookmarked([...bookmarked, id]);
      setShowBookmarkToast(true);
      setTimeout(() => setShowBookmarkToast(false), 3000);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBlogs.length) % featuredBlogs.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-16">
     
        <div className="max-w-5xl mx-auto pt-10">
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-10">
            {featuredBlogs.length > 0 && (
              <div className="relative h-72 md:h-96">
                <img
                  src={featuredBlogs[currentSlide].image}
                  alt={featuredBlogs[currentSlide].title}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                  <span className="text-sm text-white/80 mb-2">{featuredBlogs[currentSlide].date} • {featuredBlogs[currentSlide].readTime}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {featuredBlogs[currentSlide].title}
                  </h2>
                  <p className="text-white/90 mb-4 max-w-xl">{featuredBlogs[currentSlide].excerpt}</p>
                  <Link to="#" className="inline-block bg-white/90 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-white">Read More</Link>
                </div>
             
                <button onClick={handlePrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-10">
                  &#8592;
                </button>
                <button onClick={handleNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-10">
                  &#8594;
                </button>
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {featuredBlogs.map((_, idx) => (
                    <span key={idx} className={`h-2 w-2 rounded-full ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`}></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

       
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${activeCategory === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search blog titles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Blog Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {filteredBlogs.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-16">No blogs found.</div>
          ) : (
            filteredBlogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105">
                <img src={blog.image} alt={blog.title} className="h-48 w-full object-cover" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{categories.find(c => c.id === blog.category)?.name || 'Other'}</span>
                    <span className="text-xs text-gray-400">{blog.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 mt-auto mb-2">
                    <span className="text-xs text-gray-500">{blog.readTime}</span>
                    <span className="text-xs text-gray-500">{blog.likes} Likes</span>
                    <span className="text-xs text-gray-500">{blog.comments} Comments</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => handleBookmark(blog.id)}
                      className={`text-xl ${bookmarked.includes(blog.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} transition-colors`}
                      title={bookmarked.includes(blog.id) ? 'Remove Bookmark' : 'Bookmark'}
                    >
                      {bookmarked.includes(blog.id) ? '★' : '☆'}
                    </button>
                    <Link to="#" className="text-blue-600 font-semibold hover:underline">Read More</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bookmark Toast */}
        {showBookmarkToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            Blog bookmarked!
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogPage; 



//  9846142271
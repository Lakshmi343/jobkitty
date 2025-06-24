import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen relative">
      {/* ... rest of your BlogPage JSX ... */}
    </div>
  );
};

export default BlogPage; 
import React, { useState, useEffect } from "react";
import { Dialog } from "./ui/dialog";

const blogPosts = [
  {
    id: 1,
    title: "How to Land Your Dream Job in 2024",
    date: "June 10, 2024",
    author: "Admin",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    tags: ["Career", "Tips"],
    excerpt: "Discover the latest strategies and tips to stand out in the competitive job market this year.",
    content: `Landing your dream job in 2024 requires a mix of traditional and modern strategies. Start by optimizing your resume, building a strong LinkedIn profile, and networking both online and offline. Don't forget to tailor your applications and prepare for virtual interviews. Stay persistent and keep learning new skills!`,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Top 5 Skills Employers Look For",
    date: "May 28, 2024",
    author: "Admin",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    tags: ["Skills", "Employability"],
    excerpt: "A breakdown of the most in-demand skills that can boost your employability in any industry.",
    content: `Employers in 2024 are seeking candidates with strong communication, problem-solving, adaptability, tech-savviness, and teamwork skills. Focus on developing these areas and highlight them in your applications and interviews for the best results!`,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Remote Work: Pros, Cons, and Best Practices",
    date: "May 15, 2024",
    author: "Admin",
    authorAvatar: "https://randomuser.me/api/portraits/men/65.jpg",
    tags: ["Remote Work", "Productivity"],
    excerpt: "Is remote work right for you? Explore the benefits, challenges, and tips for success.",
    content: `Remote work offers flexibility and autonomy, but it also requires discipline and strong communication. Set clear boundaries, use productivity tools, and stay connected with your team to make the most of remote opportunities!`,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-96" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col"
              tabIndex={0}
              aria-label={`Read more about ${post.title}`}
              onClick={() => setSelectedPost(post)}
              onKeyDown={e => { if (e.key === 'Enter') setSelectedPost(post); }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full border" />
                  <span className="text-sm text-gray-600">{post.author}</span>
                  <span className="text-xs text-gray-400 ml-auto">{post.date}</span>
                </div>
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-700 transition-colors">{post.title}</h2>
                <div className="flex gap-2 mb-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 flex-1">{post.excerpt}</p>
                <button
                  className="mt-auto text-blue-600 hover:underline font-medium focus:outline-none"
                  tabIndex={-1}
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {/* Modal for full post */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative z-50 animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={() => setSelectedPost(null)}
                aria-label="Close"
              >
                ×
              </button>
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-48 object-cover rounded mb-4" />
              <div className="flex items-center gap-3 mb-2">
                <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-8 h-8 rounded-full border" />
                <span className="text-sm text-gray-600">{selectedPost.author}</span>
                <span className="text-xs text-gray-400 ml-auto">{selectedPost.date}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{selectedPost.title}</h2>
              <div className="flex gap-2 mb-2">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedPost.content}</p>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Blog; 
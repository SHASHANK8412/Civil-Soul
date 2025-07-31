import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Tag,
  Clock,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Bookmark,
  ThumbsUp
} from 'lucide-react';

const Blogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  // Sample blog data
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Mental Health in Community Service: Finding Purpose Through Helping Others",
      excerpt: "Discover how volunteering and community service can significantly improve mental well-being and create lasting positive impact.",
      content: "Full blog content here...",
      author: "Dr. Sarah Johnson",
      authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      category: "Mental Health",
      tags: ["mental-health", "community", "volunteering", "wellness"],
      publishedAt: "2024-12-15",
      readTime: "8 min read",
      views: 1247,
      likes: 89,
      comments: 23,
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "The Ultimate Guide to Organizing Blood Donation Drives",
      excerpt: "Step-by-step guide to organizing successful blood donation campaigns in your community.",
      content: "Full blog content here...",
      author: "Marcus Rodriguez",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      category: "Health",
      tags: ["blood-donation", "health", "community", "organization"],
      publishedAt: "2024-12-12",
      readTime: "12 min read",
      views: 892,
      likes: 67,
      comments: 15,
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Sustainable Living: Small Changes, Big Environmental Impact",
      excerpt: "Learn practical ways to reduce your carbon footprint and contribute to environmental conservation.",
      content: "Full blog content here...",
      author: "Emma Green",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face",
      category: "Environment",
      tags: ["environment", "sustainability", "climate", "conservation"],
      publishedAt: "2024-12-10",
      readTime: "6 min read",
      views: 1456,
      likes: 134,
      comments: 34,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 4,
      title: "Animal Rescue Stories: Heroes Without Capes",
      excerpt: "Heartwarming stories of animal rescue volunteers and their life-changing work.",
      content: "Full blog content here...",
      author: "David Miller",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      category: "Animal Welfare",
      tags: ["animals", "rescue", "volunteering", "stories"],
      publishedAt: "2024-12-08",
      readTime: "10 min read",
      views: 743,
      likes: 98,
      comments: 28,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "Supporting Our Elderly: Building Intergenerational Connections",
      excerpt: "How to create meaningful relationships with elderly community members and combat loneliness.",
      content: "Full blog content here...",
      author: "Lisa Chen",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      category: "Elderly Care",
      tags: ["elderly", "community", "relationships", "support"],
      publishedAt: "2024-12-05",
      readTime: "7 min read",
      views: 634,
      likes: 76,
      comments: 19,
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "The Psychology of Giving: Why Helping Others Makes Us Happy",
      excerpt: "Scientific insights into how acts of kindness and volunteering benefit our mental health.",
      content: "Full blog content here...",
      author: "Dr. Michael Thompson",
      authorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      category: "Psychology",
      tags: ["psychology", "giving", "happiness", "research"],
      publishedAt: "2024-12-03",
      readTime: "9 min read",
      views: 1123,
      likes: 156,
      comments: 42,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop",
      featured: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories', count: blogs.length },
    { id: 'Mental Health', name: 'Mental Health', count: blogs.filter(b => b.category === 'Mental Health').length },
    { id: 'Health', name: 'Health', count: blogs.filter(b => b.category === 'Health').length },
    { id: 'Environment', name: 'Environment', count: blogs.filter(b => b.category === 'Environment').length },
    { id: 'Animal Welfare', name: 'Animal Welfare', count: blogs.filter(b => b.category === 'Animal Welfare').length },
    { id: 'Elderly Care', name: 'Elderly Care', count: blogs.filter(b => b.category === 'Elderly Care').length },
    { id: 'Psychology', name: 'Psychology', count: blogs.filter(b => b.category === 'Psychology').length }
  ];

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const featuredBlogs = blogs.filter(blog => blog.featured);

  const handleBookmark = (blogId) => {
    setBookmarkedPosts(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleLike = (blogId) => {
    setLikedPosts(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
    
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { ...blog, likes: likedPosts.includes(blogId) ? blog.likes - 1 : blog.likes + 1 }
        : blog
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              CivilSoul Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Stories of Impact, Guides for Change, and Insights for a Better World
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/blogs/write')}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Write a Story
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Subscribe to Newsletter
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs, topics, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="latest">Latest First</option>
                <option value="popular">Most Popular</option>
                <option value="liked">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredBlogs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredBlogs.slice(0, 2).map((blog) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleBookmark(blog.id)}
                        className={`p-2 rounded-full transition-colors ${
                          bookmarkedPosts.includes(blog.id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {blog.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={blog.authorImage} 
                          alt={blog.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{blog.author}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(blog.publishedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center text-sm">
                          <Eye className="w-4 h-4 mr-1" />
                          {blog.views}
                        </span>
                        <button
                          onClick={() => handleLike(blog.id)}
                          className={`flex items-center text-sm transition-colors ${
                            likedPosts.includes(blog.id) ? 'text-red-500' : 'hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${likedPosts.includes(blog.id) ? 'fill-current' : ''}`} />
                          {blog.likes}
                        </button>
                        <span className="flex items-center text-sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {blog.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
            All Articles
            <span className="ml-3 text-lg text-gray-500 dark:text-gray-400 font-normal">
              ({filteredBlogs.length} articles)
            </span>
          </h2>
          
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleBookmark(blog.id)}
                        className={`p-2 rounded-full transition-colors ${
                          bookmarkedPosts.includes(blog.id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {blog.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer line-clamp-2">
                      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={blog.authorImage} 
                          alt={blog.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{blog.author}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(blog.publishedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center text-sm">
                          <Eye className="w-4 h-4 mr-1" />
                          {blog.views}
                        </span>
                        <button
                          onClick={() => handleLike(blog.id)}
                          className={`flex items-center text-sm transition-colors ${
                            likedPosts.includes(blog.id) ? 'text-red-500' : 'hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${likedPosts.includes(blog.id) ? 'fill-current' : ''}`} />
                          {blog.likes}
                        </button>
                        <span className="flex items-center text-sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {blog.comments}
                        </span>
                      </div>
                      <Link
                        to={`/blogs/${blog.id}`}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-sm flex items-center"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Our Stories</h3>
            <p className="text-purple-100 mb-6">Get the latest articles, volunteer opportunities, and community impact stories delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blogs;

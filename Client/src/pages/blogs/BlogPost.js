import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Send
} from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  // Sample blog post data (in a real app, this would come from an API)
  const samplePost = {
    id: parseInt(id),
    title: "Mental Health in Community Service: Finding Purpose Through Helping Others",
    content: `
# Introduction

Community service has long been recognized as a cornerstone of healthy societies, but recent research has revealed something remarkable: volunteering and helping others can be just as beneficial for the giver as it is for the receiver. In our increasingly connected yet often isolating world, finding meaning and purpose through community service has emerged as a powerful tool for mental health and wellbeing.

## The Science Behind Helping Others

When we engage in acts of service, our brains release a cocktail of feel-good chemicals including oxytocin, serotonin, and endorphins. This phenomenon, often called the "helper's high," creates a natural antidepressant effect that can last for hours or even days after the act of service.

### Key Benefits Include:

- **Reduced Depression and Anxiety**: Studies show that volunteers report 25% lower rates of depression compared to non-volunteers
- **Increased Life Satisfaction**: Regular volunteers score higher on life satisfaction surveys
- **Enhanced Self-Esteem**: Helping others provides a sense of accomplishment and purpose
- **Stronger Social Connections**: Volunteering creates opportunities for meaningful relationships

## Finding Your Purpose Through Service

Not all volunteer work will resonate with every individual. The key is finding service opportunities that align with your values, interests, and skills. Here are some areas to consider:

### 1. Mental Health Support
Working with organizations that provide mental health services can be particularly rewarding. Whether it's:
- Crisis hotline support
- Peer counseling programs
- Community mental health awareness campaigns
- Support groups for specific conditions

### 2. Education and Mentorship
Sharing knowledge and guiding others can provide immense satisfaction:
- Tutoring children or adults
- Mentoring youth in your professional field
- Teaching life skills to those in need
- Supporting literacy programs

### 3. Environmental Conservation
For those passionate about the planet:
- Local clean-up initiatives
- Tree planting programs
- Environmental education
- Sustainable living workshops

### 4. Animal Welfare
Helping vulnerable animals can be deeply fulfilling:
- Animal shelter volunteering
- Wildlife rehabilitation
- Pet therapy programs
- Animal rescue operations

## Getting Started: A Practical Guide

If you're new to volunteering or looking to make a career change toward service, here's how to begin:

### Step 1: Self-Assessment
- Identify your passions and interests
- Consider your available time and schedule
- Assess your skills and what you can offer
- Reflect on what you hope to gain from the experience

### Step 2: Research Opportunities
- Look for local organizations in your area
- Check online volunteer matching platforms
- Ask friends and family about their experiences
- Contact organizations directly to learn about their needs

### Step 3: Start Small
- Begin with a small time commitment
- Try different types of service to find your fit
- Don't be afraid to explore multiple organizations
- Build your involvement gradually

### Step 4: Make it Sustainable
- Choose commitments you can realistically maintain
- Set boundaries to prevent burnout
- Celebrate your contributions and impact
- Connect with other volunteers for support

## The Ripple Effect

When you engage in community service for your mental health, you create a positive ripple effect that extends far beyond your personal wellbeing:

1. **Your direct impact** on the individuals or causes you serve
2. **Community strengthening** through your active participation
3. **Inspiring others** to get involved through your example
4. **Systemic change** when enough people participate in service

## Conclusion

Finding purpose through community service is not just about giving back—it's about finding yourself, building connections, and creating meaning in your life. The mental health benefits are well-documented and profound, making service one of the most effective and fulfilling paths to psychological wellbeing.

Remember, the goal isn't to solve all the world's problems, but to contribute what you can while nurturing your own mental health and sense of purpose. Start where you are, use what you have, and do what you can. Your mental health—and your community—will be better for it.

*If you're struggling with mental health issues, community service can be a valuable complement to professional treatment, but it should not replace proper medical care. Always consult with mental health professionals for serious concerns.*
    `,
    excerpt: "Discover how volunteering and community service can significantly improve mental well-being and create lasting positive impact.",
    author: {
      name: "Dr. Sarah Johnson",
      bio: "Dr. Sarah Johnson is a licensed clinical psychologist specializing in community mental health and the therapeutic benefits of service. She has over 15 years of experience in both clinical practice and community research.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      social: {
        twitter: "@drsarahjohnson",
        linkedin: "drsarah-johnson"
      }
    },
    category: "Mental Health",
    tags: ["mental-health", "community", "volunteering", "wellness", "purpose", "psychology"],
    publishedAt: "2024-12-15",
    updatedAt: "2024-12-15",
    readTime: "8 min read",
    views: 1247,
    likes: 89,
    comments: 23,
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop",
    featured: true
  };

  // Sample comments data
  const sampleComments = [
    {
      id: 1,
      author: "Maria Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=80&h=80&fit=crop&crop=face",
      content: "This article really resonated with me. I started volunteering at a local food bank after reading about the mental health benefits, and I can definitely confirm the 'helper's high' is real!",
      timestamp: "2024-12-16T10:30:00Z",
      likes: 12,
      replies: []
    },
    {
      id: 2,
      author: "James Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      content: "Great insights, Dr. Johnson. I've been struggling with depression and my therapist actually recommended volunteer work. This article gave me some concrete ideas on where to start.",
      timestamp: "2024-12-16T14:15:00Z",
      likes: 8,
      replies: [
        {
          id: 3,
          author: "Dr. Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
          content: "I'm so glad this was helpful, James! Starting small is key. Even a few hours a month can make a difference. Best of luck on your journey!",
          timestamp: "2024-12-16T15:00:00Z",
          likes: 15
        }
      ]
    },
    {
      id: 4,
      author: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      content: "As someone who coordinates volunteers at an animal shelter, I see firsthand how much our volunteers benefit from the work they do. It's a beautiful two-way street.",
      timestamp: "2024-12-17T09:20:00Z",
      likes: 20,
      replies: []
    }
  ];

  useEffect(() => {
    // Simulate loading blog post data
    setTimeout(() => {
      setPost(samplePost);
      setComments(sampleComments);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setPost(prev => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
    }
    setShowShareModal(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: "Current User", // In a real app, this would come from auth state
        avatar: "/api/placeholder/40/40",
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blogs"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.views} views
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likes}</span>
              </button>
              
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarked 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Featured Image */}
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          
          <div className="p-8">
            {/* Title and Meta */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{post.author.name}</div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(post.publishedAt)}
                    </span>
                    {post.updatedAt !== post.publishedAt && (
                      <span>Updated {formatDate(post.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                <span className="flex items-center text-sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {comments.length} comments
                </span>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${tag}`}
                  className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Link>
              ))}
            </div>
            
            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br />').replace(/### /g, '<h3>').replace(/## /g, '<h2>').replace(/# /g, '<h1>') 
                }} 
              />
            </div>
            
            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{post.author.bio}</p>
                  {post.author.social && (
                    <div className="flex items-center space-x-4 mt-3">
                      {post.author.social.twitter && (
                        <a 
                          href={`https://twitter.com/${post.author.social.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          {post.author.social.twitter}
                        </a>
                      )}
                      {post.author.social.linkedin && (
                        <a 
                          href={`https://linkedin.com/in/${post.author.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex space-x-4">
              <img 
                src="/api/placeholder/40/40" 
                alt="Your avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <img 
                  src={comment.avatar} 
                  alt={comment.author}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatTime(comment.timestamp)}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <img 
                            src={reply.avatar} 
                            alt={reply.author}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">{reply.author}</h5>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(reply.timestamp)}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                              <div className="flex items-center space-x-3 mt-2">
                                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span className="text-xs">{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Article</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Share on Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center space-x-3 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span>Share on Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>Share on LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;

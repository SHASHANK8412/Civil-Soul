const express = require('express');
const Blog = require('../models/Blog');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blogs
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      featured,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === 'true';
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName profileImage')
      .select('-content') // Exclude full content for list view
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage')
      .populate('comments.replies.user', 'firstName lastName profileImage');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/unlike a blog
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const existingLike = blog.likes.find(like => like.user.toString() === req.user.id);

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      // Like
      blog.likes.push({ user: req.user.id });
    }

    await blog.save();

    res.json({
      success: true,
      liked: !existingLike,
      likesCount: blog.likes.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

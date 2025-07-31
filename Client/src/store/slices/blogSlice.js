import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogs: [],
  currentBlog: null,
  featuredBlogs: [],
  categories: [
    'mental-health',
    'wellness',
    'volunteering',
    'environment',
    'community',
    'self-care',
    'motivation',
    'success-stories'
  ],
  filters: {
    category: '',
    search: '',
    featured: false,
  },
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    setFeaturedBlogs: (state, action) => {
      state.featuredBlogs = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleLike: (state, action) => {
      const blogId = action.payload;
      const blog = state.blogs.find(b => b._id === blogId);
      if (blog) {
        blog.isLiked = !blog.isLiked;
        blog.likesCount += blog.isLiked ? 1 : -1;
      }
      if (state.currentBlog && state.currentBlog._id === blogId) {
        state.currentBlog.isLiked = !state.currentBlog.isLiked;
        state.currentBlog.likesCount += state.currentBlog.isLiked ? 1 : -1;
      }
    },
  },
});

export const {
  setBlogs,
  setCurrentBlog,
  setFeaturedBlogs,
  setFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  toggleLike,
} = blogSlice.actions;

export default blogSlice.reducer;

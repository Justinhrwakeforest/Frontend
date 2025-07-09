// src/components/PostsFeed.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MessageCircle, Heart, Bookmark, Share2, MoreVertical,
  TrendingUp, Clock, Filter, Plus, Hash, Image,
  Code, Link as LinkIcon, Send, X, ChevronDown,
  ThumbsUp, Smile, Lightbulb, PartyPopper, Handshake,
  HelpCircle, AlertCircle, Pin, Lock, Flag
} from 'lucide-react';
import { useNotifications } from './NotificationSystem';
import { formatDistanceToNow } from 'date-fns';

// Rich Text Editor Component (simplified)
const RichTextEditor = ({ value, onChange, placeholder, onSubmit }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef(null);

  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className="relative">
      {showToolbar && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Bold"
          >
            <strong className="text-sm">B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Italic"
          >
            <em className="text-sm">I</em>
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```\n', '\n```')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Code block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('[', '](url)')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowToolbar(true)}
        onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="4"
      />
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>Markdown supported</span>
        <span>Ctrl+Enter to submit</span>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(post.user_reaction);
  const { success, error } = useNotifications();
  const navigate = useNavigate();

  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'insightful', emoji: '💡', label: 'Insightful' },
    { type: 'celebrate', emoji: '🎉', label: 'Celebrate' },
    { type: 'support', emoji: '🤝', label: 'Support' },
    { type: 'curious', emoji: '🤔', label: 'Curious' }
  ];

  const handleReaction = async (reactionType) => {
    try {
      const response = await axios.post(`/api/posts/${post.id}/react/`, {
        reaction_type: reactionType
      });
      
      setUserReaction(reactionType);
      setIsLiked(true);
      if (reactionType === 'like' && !userReaction) {
        setLikeCount(prev => prev + 1);
      }
      setShowReactions(false);
      success('Reaction added!');
    } catch (err) {
      error('Failed to add reaction');
    }
  };

  const handleRemoveReaction = async () => {
    try {
      await axios.delete(`/api/posts/${post.id}/unreact/`);
      setUserReaction(null);
      setIsLiked(false);
      if (userReaction === 'like') {
        setLikeCount(prev => Math.max(0, prev - 1));
      }
      success('Reaction removed');
    } catch (err) {
      error('Failed to remove reaction');
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await axios.post(`/api/posts/${post.id}/bookmark/`);
      setIsBookmarked(response.data.bookmarked);
      success(response.data.message);
    } catch (err) {
      error('Failed to update bookmark');
    }
  };

  const handleShare = async (platform = 'copy_link') => {
    try {
      await axios.post(`/api/posts/${post.id}/share/`, { platform });
      
      if (platform === 'copy_link') {
        navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
        success('Link copied to clipboard!');
      }
    } catch (err) {
      error('Failed to share post');
    }
  };

  const getPostTypeIcon = () => {
    switch (post.post_type) {
      case 'question': return <HelpCircle className="w-4 h-4" />;
      case 'announcement': return <AlertCircle className="w-4 h-4" />;
      case 'resource': return <LinkIcon className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Post Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/users/${post.author.username}`}
                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.author_name}
                </Link>
                {post.is_anonymous && (
                  <span className="text-xs text-gray-500">(Anonymous)</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                {post.edited_at && <span>• edited</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {post.is_pinned && (
              <Pin className="w-4 h-4 text-blue-600" />
            )}
            {post.is_locked && (
              <Lock className="w-4 h-4 text-gray-600" />
            )}
            {getPostTypeIcon()}
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Post Title */}
        {post.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <Link to={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
              {post.title}
            </Link>
          </h3>
        )}

        {/* Post Content Preview */}
        <div className="text-gray-700 mb-4 line-clamp-3">
          {post.content_preview}
        </div>

        {/* Post Image Preview */}
        {post.first_image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.first_image.image} 
              alt={post.first_image.caption || 'Post image'}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Topics */}
        {post.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.topics.map(topic => (
              <Link
                key={topic.id}
                to={`/posts?topic=${topic.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Hash className="w-3 h-3 mr-1" />
                {topic.name}
              </Link>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            {/* Reaction Button */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                onClick={() => userReaction ? handleRemoveReaction() : handleReaction('like')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isLiked 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {userReaction ? (
                  <span className="text-lg">
                    {reactionTypes.find(r => r.type === userReaction)?.emoji}
                  </span>
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              
              {/* Reaction Picker */}
              {showReactions && !userReaction && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex space-x-1 z-10">
                  {reactionTypes.map(reaction => (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(reaction.type)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all transform hover:scale-110"
                      title={reaction.label}
                    >
                      <span className="text-xl">{reaction.emoji}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{post.comment_count}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => handleShare()}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">{post.share_count}</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
          <CommentSection postId={post.id} isLocked={post.is_locked} />
        </div>
      )}
    </div>
  );
};

// Comment Section Component
const CommentSection = ({ postId, isLocked }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useNotifications();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/?post=${postId}`);
      setComments(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      error('Failed to load comments');
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await axios.post('/api/comments/', {
        post: postId,
        content: newComment
      });
      
      setComments([response.data, ...comments]);
      setNewComment('');
      success('Comment posted!');
    } catch (err) {
      error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      {!isLocked && (
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSubmitComment();
                }
              }}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows="2"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

// Comment Item Component
const CommentItem = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/comments/${comment.id}/like/`);
      setIsLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to like comment');
    }
  };

  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold">
        {comment.author_name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-gray-900">{comment.author_name}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
              {comment.edited_at && <span className="text-xs text-gray-500">• edited</span>}
            </div>
          </div>
          <p className="text-sm text-gray-700">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount > 0 && likeCount}</span>
          </button>
          
          {comment.reply_count > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}
        </div>

        {/* Replies */}
        {showReplies && comment.replies && (
          <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Posts Feed Component
const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'hot',
    type: '',
    topic: ''
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [topics, setTopics] = useState([]);
  const { success, error } = useNotifications();

  useEffect(() => {
    fetchPosts();
    fetchTopics();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.type) params.append('type', filters.type);
      if (filters.topic) params.append('topic', filters.topic);

      const response = await axios.get(`/api/posts/?${params}`);
      setPosts(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      error('Failed to load posts');
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/topics/trending/');
      setTopics(response.data);
    } catch (err) {
      console.error('Failed to load topics');
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
    success('Post created successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Posts</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Sort Filter */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hot">🔥 Hot</option>
            <option value="new">🆕 New</option>
            <option value="top">⬆️ Top</option>
            <option value="discussed">💬 Most Discussed</option>
          </select>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="discussion">💭 Discussion</option>
            <option value="question">❓ Question</option>
            <option value="announcement">📢 Announcement</option>
            <option value="resource">📚 Resource</option>
            <option value="event">📅 Event</option>
          </select>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreatePost(true)}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>

        {/* Trending Topics */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Trending:</span>
            {topics.slice(0, 8).map(topic => (
              <button
                key={topic.id}
                onClick={() => setFilters({ ...filters, topic: topic.slug })}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.topic === topic.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{topic.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onUpdate={(updatedPost) => {
                setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

// Create Post Modal Component
const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'discussion',
    topic_names: [],
    is_anonymous: false,
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const { error } = useNotifications();
  const [currentTopic, setCurrentTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'topic_names') {
          formData[key].forEach(topic => data.append('topic_names', topic));
        } else if (key === 'images') {
          formData[key].forEach(image => data.append('images', image));
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post('/api/posts/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onPostCreated(response.data);
    } catch (err) {
      error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const addTopic = () => {
    if (currentTopic.trim() && !formData.topic_names.includes(currentTopic.trim())) {
      setFormData({
        ...formData,
        topic_names: [...formData.topic_names, currentTopic.trim()]
      });
      setCurrentTopic('');
    }
  };

  const removeTopic = (topic) => {
    setFormData({
      ...formData,
      topic_names: formData.topic_names.filter(t => t !== topic)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <select
              value={formData.post_type}
              onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="discussion">💭 Discussion</option>
              <option value="question">❓ Question</option>
              <option value="announcement">📢 Announcement</option>
              <option value="resource">📚 Resource</option>
              <option value="event">📅 Event</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give your post a title..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Share your thoughts, ask a question, or start a discussion..."
              onSubmit={handleSubmit}
            />
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTopic();
                  }
                }}
                placeholder="Add a topic..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.topic_names.map(topic => (
                <span
                  key={topic}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
                >
                  #{topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Anonymous Option */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_anonymous}
              onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Post anonymously</span>
          </label>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.content.trim() || submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostsFeed;

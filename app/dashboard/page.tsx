'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession, type SessionUser } from '@/lib/session';
import { getTheme, toggleTheme as toggleThemeUtil } from '@/lib/theme';

interface Post {
  id: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'compose' | 'posts' | 'profile'>('compose');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  
  // Profile editing state
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    about: '',
    profileImage: '',
  });

  // User data from session
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    // Check session
    const session = getSession();
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    setUser(session);
    setProfileData({
      username: session.username,
      about: session.about || '',
      profileImage: session.profileImage || '',
    });

    // Set theme
    const currentTheme = getTheme();
    setTheme(currentTheme);
  }, [router]);

  useEffect(() => {
    if (activeTab === 'posts' && user) {
      fetchPosts();
    }
  }, [activeTab, user]);

  const fetchPosts = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/posts', {
        headers: {
          'x-user-id': user.id,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ content: newPost }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create post');
        setLoading(false);
        return;
      }

      setNewPost('');
      setLoading(false);
      setActiveTab('posts');
      fetchPosts();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setProfileError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData({ ...profileData, profileImage: reader.result as string });
      setProfileError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileError(data.error || 'Failed to update profile');
        setProfileLoading(false);
        return;
      }

      // Update user data and session
      const updatedUser = {
        ...user!,
        username: profileData.username,
        about: profileData.about,
        profileImage: profileData.profileImage,
      };
      setUser(updatedUser);
      
      // Update session storage
      const session = getSession();
      if (session) {
        session.username = profileData.username;
        session.about = profileData.about;
        session.profileImage = profileData.profileImage;
        localStorage.setItem('session_user', JSON.stringify(session));
      }

      setProfileSuccess(true);
      setProfileLoading(false);
      
      setTimeout(() => {
        setEditMode(false);
        setProfileSuccess(false);
      }, 2000);
    } catch (err) {
      setProfileError('An error occurred. Please try again.');
      setProfileLoading(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    router.push('/');
  };

  const handleToggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
  };

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer">
              Déjà You
            </h1>
          </Link>
          <nav className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <div className="flex items-center gap-3">
              {user.profileImage && (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.username}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-full px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.username}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal digital log
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'compose'
                ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            📝 Compose
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            📚 My Posts
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            👤 Profile
          </button>
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Create a New Post
            </h3>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <div>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  maxLength={280}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="What's on your mind?"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {newPost.length}/280 characters
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !newPost.trim()}
                    className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Posts
            </h3>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">
                  No posts yet. Create your first post!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileImage || '/default-avatar.png'}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {post.createdAt && !isNaN(new Date(post.createdAt).getTime())
                            ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedPost(post)}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        aria-label="Expand post"
                      >
                        🔍
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        aria-label="Delete post"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab - keeping existing profile code */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Profile
              </h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {profileError && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Profile updated successfully!
                  </div>
                )}

                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="relative">
                    <img
                      src={profileData.profileImage || user.profileImage || '/default-avatar.png'}
                      alt={profileData.username}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
                    >
                      📷
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click the camera icon to upload a new profile image
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({ ...profileData, username: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    About
                  </label>
                  <textarea
                    id="about"
                    value={profileData.about}
                    onChange={(e) =>
                      setProfileData({ ...profileData, about: e.target.value })
                    }
                    rows={3}
                    maxLength={160}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Tell us about yourself (max 160 characters)"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {profileData.about.length}/160 characters
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setProfileData({
                        username: user.username,
                        about: user.about || '',
                        profileImage: user.profileImage || '',
                      });
                      setProfileError('');
                      setProfileSuccess(false);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <img
                    src={user.profileImage || '/default-avatar.png'}
                    alt={user.username}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.username}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    About
                  </label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    {user.about || 'No bio yet'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Expanded Post Modal */}
      {expandedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setExpandedPost(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || '/default-avatar.png'}
                  alt={user.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {expandedPost.createdAt && !isNaN(new Date(expandedPost.createdAt).getTime())
                      ? new Date(expandedPost.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Unknown date'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExpandedPost(null)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              {expandedPost.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

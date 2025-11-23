import { db } from '@/src/db';
import { posts, users } from '@/src/db/schema';
import { desc, eq } from 'drizzle-orm';

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch the latest posts from the database
  const latestPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      username: users.username,
      profileImage: users.profileImage,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Déjà You
          </h1>
          <nav className="flex gap-4">
            <a
              href="/auth/signin"
              className="rounded-full px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              Sign Up
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your Personal Digital Log
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Capture your thoughts, moments, and memories in your own private space.
          </p>
        </div>

        {/* Quote of the Day Section */}
        <div className="mb-8">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Quote of the Day
          </h3>
          
          {latestPosts.length > 0 ? (
            <div className="space-y-4">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-center gap-3">
                    {post.profileImage && (
                      <img
                        src={post.profileImage}
                        alt={post.username || 'User'}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {post.username || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.createdAt && !isNaN(new Date(post.createdAt).getTime())
                          ? new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-gray-500 dark:text-gray-400">
                No posts yet. Sign up to start sharing your thoughts!
              </p>
            </div>
          )}
        </div>

        {/* Database Status */}
        <div className="mt-8 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-center text-sm font-medium text-green-800 dark:text-green-300">
            ✅ Database Connected • {latestPosts.length} posts loaded
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm py-6 dark:border-gray-800 dark:bg-black/80">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Déjà You - Your Personal Digital Log</p>
        </div>
      </footer>
    </div>
  );
}

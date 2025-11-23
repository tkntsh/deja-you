import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { posts, users } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createPostSchema } from '@/lib/validations';

// GET - Fetch all posts for the current user
export async function GET(request: NextRequest) {
  try {
    // Get user ID from header (set by client)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json({ posts: userPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = createPostSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.issues[0].message },
        { status: 400 }
      );
    }

    const { content } = validatedFields.data;

    // Get user ID from header
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create post
    const newPost = await db
      .insert(posts)
      .values({
        content,
        userId: userId,
      })
      .returning();

    return NextResponse.json({
      success: true,
      post: newPost[0],
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

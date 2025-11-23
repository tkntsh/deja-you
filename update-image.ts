import { db } from './src/db';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function updateProfileImage() {
  console.log('Updating profile image...');

  try {
    await db
      .update(users)
      .set({ profileImage: '/qotd-pfp.jpg' })
      .where(eq(users.username, 'inthemindoftheMacXhine'));

    console.log('Profile image updated successfully!');
  } catch (error) {
    console.error('Error updating profile image:', error);
  }
}

updateProfileImage();

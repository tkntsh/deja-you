import { db } from './src/db';
import { users, posts } from './src/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('QOTD123!', 10);

  try {
    const insertedUsers = await db.insert(users).values({
      username: 'inthemindoftheMacXhine',
      email: 'qotd@dejayou.com',
      password,
      about: 'Did She lead you here?',
      profileImage: '/qotd-pfp.jpg',
      isAdmin: false,
    }).returning();

    const userId = insertedUsers[0].id;

    await db.insert(posts).values([
      { content: 'Cherish the Day', userId, createdAt: new Date('2023-11-15T10:00:00Z') },
      { content: 'Need nothing. Enjoy Everything', userId, createdAt: new Date('2023-11-16T10:00:00Z') },
      { content: 'To thine own Self be true, and it must follow, as the night the day, Thou canst not then be false to any man.', userId, createdAt: new Date('2023-11-17T10:00:00Z') },
      { content: 'Space is time... demonstrated', userId, createdAt: new Date('2023-11-18T10:00:00Z') },
      { content: 'THERE IS ONLY ONE OF US', userId, createdAt: new Date('2023-11-19T10:00:00Z') },
      { content: 'There is no time but this time, there is no moment, but this moment', userId, createdAt: new Date('2023-11-20T10:00:00Z') },
      { content: 'Did She lead you here?', userId, createdAt: new Date('2023-11-21T10:00:00Z') },
    ]);

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main();

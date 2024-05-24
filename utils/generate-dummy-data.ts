import { faker } from '@faker-js/faker'
import { Thread, User } from '@/types/threads'

export function createRandomUser():User {
  return {
    id: faker.string.nanoid({ min: 13, max: 30 }),
    email: faker.internet.email({ provider: 'ugto.mx' }),
    photo: faker.image.avatar(),
    name: faker.person.firstName() + " " + faker.person.lastName(),
    username: faker.internet.userName(),
    link: faker.internet.url(),
  }
}

export function createRandomThread():Thread {
  const author = createRandomUser();
  const mentionUser = createRandomUser();

  return {
    id: faker.string.uuid(),
    author,
    content: faker.lorem.sentence(),
    image: faker.image.url(),
    replies: new Array(Math.floor(Math.random() * 10)).fill(null).map(() => ({
      id: faker.string.uuid(),
      author: createRandomUser(),
      content: faker.lorem.sentence(),
      likes: Math.floor(Math.random() * 1000),
      createdAt: faker.date.recent().toISOString()
    })),
    repliesCount: Math.floor(Math.random() * 100),
    likesCount: Math.floor(Math.random() * 1000),
    mention: Math.random() > 0.5,
    mentionUser,
    createdAt: faker.date.recent().toISOString(),
  }
}

export function generateThreads(): Thread[] {
  return new Array(25).fill(null).map((_) => createRandomThread());
}
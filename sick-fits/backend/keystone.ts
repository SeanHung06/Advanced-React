import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { insertSeedData } from './seed-data';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stayed signed in ?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial notes here
  },
});

export default withAuth(
  config({
    // @ts-ignore
    server: {
      cors: {
        origin: ['process.env.FRONTEND_URL'],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // Add data seeding here :
      async onConnect(keystone) {
        console.log('Connected to the database');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // TODO : change this for notes
      isAccessAllowed: ({ session }) => {
        console.log(session);
        return !!session?.data;
      },
    },
    // TODO: Add session values here
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id',
    }),
  })
);

import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
  // access
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // The difference is only people with the permission cna delete themselves
    delete: permissions.canManageUsers,
  },
  // ui
  ui:{
    // Hide the backend UI from regular users
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),

  },


  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    // TODO , add notes , cost and orders
    cart : relationship({
      ref: 'CartItem.user',
      many : true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),

    orders: relationship({ref:'Order.user',many : true}),
    role: relationship({
      ref: 'Role.assignedTo',
      // Add the AccessControl for User to access the backend User Role
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,

      }
    }),

    products: relationship({
      ref: 'Product.user',
      many : true,
    }),


  },
});

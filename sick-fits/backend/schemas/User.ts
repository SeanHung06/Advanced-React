import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
  // access
  // ui
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
      // TODO: AccessControl
    })

  },
});

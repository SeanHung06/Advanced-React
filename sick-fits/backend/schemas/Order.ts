import { select, text, integer, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: ()=> false,
    delete: ()=> false,
  },

  fields: {
    label: virtual({graphQLReturnType: 'String',resolver:function(item){
        return `${formatMoney(item.total)}`;
    }}), // Add the label at keystone for User to view
    total: integer(),
    items: relationship({ ref: 'OrderItem.order',many: true}),
    user: relationship({ ref: 'User.orders'}),
    charge: text(),
  },
});

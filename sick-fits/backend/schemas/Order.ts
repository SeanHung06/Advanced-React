import { select, text, integer, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  // access;
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

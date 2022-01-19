import {list} from '@keystone-next/keystone/schema';
import {relationship, text} from '@keystone-next/fields';
import { permissionFields } from './fields';
import { permissions} from '../access';


export const Role = list({
    // To limit the Role Access 
    access: {
        create: permissions.canManageRoles,
        read: permissions.canManageRoles,
        update: permissions.canManageRoles,
        delete: permissions.canManageRoles,
    },
    // To hide the UI of Roles column to those with permissions
    ui: {
      hideCreate: (args) => !permissions.canManageRoles(args),
      hideDelete: (args) => !permissions.canManageRoles(args),
      isHidden: (args) => !permissions.canManageRoles(args),
    },
    fields: {
        name: text({ isRequired: true }),
        ...permissionFields,// Import Permission Fields File in here
        assignedTo : relationship({
            ref: 'User.role',
            many: true,
            ui:{
                itemView: { fieldMode: 'read' },
            },
        }),
    },
});
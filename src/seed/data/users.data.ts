import { User } from "src/auth/entities/user.entity";
import { RoleEnum } from "src/auth/enum/role.enum"
import { v4 as uuid } from "uuid";

const preUsers = [
    {
        username: 'gMartin',
        password: 'universalPass123',
        email: 'gMartin@example.com',
        role: RoleEnum.AUTHOR
    },
    {
        username: 'jRowling',
        password: 'universalPass123',
        email: 'jRowling@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'jTolkien',
        password: 'universalPass123',
        email: 'jTolkien@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'mCervantes',
        password: 'universalPass123',
        email: 'mCervantes@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'sKing',
        password: 'universalPass123',
        email: 'sKing@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'fHerbert',
        password: 'universalPass123',
        email: 'fHerbert@example.com',
        role: RoleEnum.AUTHOR,
    },



    {
        username: 'user1',
        password: 'password1',
        email: 'user1@example.com',
        role: RoleEnum.USER,
    },
    {
        username: 'user2',
        password: 'password2',
        email: 'user2@example.com',
        role: RoleEnum.USER,
    }
];

const users: User[] = preUsers.map((user) => { return { id: uuid(), orders: [], votes: [], shoppingCart: null, ...user } })
const usersMap = Object.fromEntries(users.map((user) => [user.username, user]));

export { usersMap };
export default users;
const connection = require("./db-connect");
const {getAllUsersQuery, getUserByIQuery, checkUserByCredentialsQuery, getUserByEmailQuery} = require("./db-queries");
const {matchPwd} = require("../helpers/authentication");


class User {
    id;
    username;
    email;
    hash;
    avatarPath;
    role;
    birthDate;
    createdAt;
    updatedAt;
    visitedAt;
    bio;
    signature;
    status;

    constructor(Id_users, Username, Email, Hash, Avatar_path, Role, Birth_date, Created_at, Updated_at, Visited_at, Bio, Signature, Status) {
        this.id = Id_users;
        this.username = Username;
        this.email = Email;
        this.hash = Hash;
        this.avatarPath = Avatar_path;
        this.role = Role;
        this.birthDate = Birth_date;
        this.createdAt = Created_at;
        this.updatedAt = Updated_at;
        this.visitedAt = Visited_at;
        this.bio = Bio;
        this.signature = Signature;
        this.status = Status;
    };

    static newUser(user) {
        return new User(user.Id_users, user.Username, user.Email, user.Hash, user.Avatar_path, user.Role, user.Birth_date, user.Created_at, user.Updated_at, user.Visited_at, user.Bio, user.Signature, user.Status);
    };

    static newUsers(users) {
        const allUsers = [];
        for (let user of users) {
            allUsers.push(this.newUser(user));
        }
        return allUsers;
    }


    async static checkCredentials(Email, Password) {
        try {
            const user = await getUserByEmail(Email);
        } catch (err) {
            console.error('Error checking credentials:', err);
        }
        if (matchPwd(user, Password)) {
            return {user, true};
        }
        return {null, false};
    }
}

async function getUsers() {
    try {
        const [rows] = await connection.query(getAllUsersQuery);
        return User.newUsers(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        // Handle errors appropriately, e.g., return an error response
    }
}

async function getUserById(id) {
    try {
        const [rows] = await connection.query(getUserByIQuery, [id]);
        return User.newUsers(rows)[0];
    } catch (err) {
        console.error('Error fetching users:', err);

    }
}

async function getUserByEmail(email) {
    try {
        const [rows] = await connection.query(getUserByEmailQuery, [email]);
        return User.newUsers(rows)[0];
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}


module.exports = {User, getUsers, getUserById};
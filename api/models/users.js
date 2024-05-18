const connection = require("./db-connect");
const {getAllUsersQuery, getUserByIQuery, checkUserByCredentialsQuery, getUserByEmailQuery} = require("./db-queries");
const {matchPwd} = require("../helpers/authentication");


class User {
    id;
    username;
    email;
    hash;
    createdAt;
    updatedAt;
    visitedAt;
    country;
    city;
    zipCode;
    streetName;
    streetNb;
    addressComplements;
    status;

    constructor(Id_users, Username, Email, Hash, Created_at, Updated_at, Visited_at, Country, City, ZipCode, StreetName, StreetNb, AddressComplement, Status) {
        this.id = Id_users;
        this.username = Username;
        this.email = Email;
        this.hash = Hash;
        this.createdAt = Created_at;
        this.updatedAt = Updated_at;
        this.visitedAt = Visited_at;
        this.country = Country;
        this.city = City;
        this.zipCode = ZipCode;
        this.streetName = StreetName;
        this.streetNb = StreetNb;
        this.addressComplements = AddressComplement;
        this.status = Status;
    };

    static newUsers(users) {
        const allUsers = [];
        for (let user of users) {
            allUsers.push(new User(...user));
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
        return new User(rows)[0];
    } catch (err) {
        console.error('Error fetching users:', err);

    }
}

async function getUserByEmail(email) {
    try {
        const [rows] = await connection.query(getUserByEmailQuery, [email]);
        return new User(rows)[0];
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}


module.exports = {User, getUsers, getUserById};
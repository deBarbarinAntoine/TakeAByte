const connection = require("./db-connect");
const mysql = require('mysql2');
const responses = require("../helpers/responses");
const {getAllUsersQuery, getUserByIdQuery, getUserByEmailQuery, createUserQuery} = require("./db-queries");
const {matchPwd} = require("../helpers/authentication");

const errDuplicateEmail = new Error('duplicate email address');
const errDuplicateUsername = new Error('duplicate username');

class User {
    id;
    username;
    email;
    hash;
    createdAt;
    updatedAt;
    country;
    city;
    zipCode;
    streetName;
    streetNb;
    addressComplements;

    constructor(Id_users, Username, Email, Hash, Created_at, Updated_at, Country, City, ZipCode, StreetName, StreetNb, AddressComplement) {
        this.id = Id_users;
        this.username = Username;
        this.email = Email;
        this.hash = Hash;
        this.createdAt = Created_at;
        this.updatedAt = Updated_at;
        this.country = Country;
        this.city = City;
        this.zipCode = ZipCode;
        this.streetName = StreetName;
        this.streetNb = StreetNb;
        this.addressComplements = AddressComplement;
    };

    static newUsers(users) {
        const allUsers = [];
        for (let user of users) {
            allUsers.push(new User(...user));
        }
        return allUsers;
    }

    static New(Username, Email, Hash) {
        return new User(undefined, Username, Email, Hash, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    }

    async create() {
        console.log (`email: ${this.email}; hash: ${this.hash}`);
        return connection.execute(createUserQuery, [this.username, this.email, this.hash]);
    }

    toJson() {
        return Object.fromEntries(
            Object.entries(this).
            filter(([k]) => {
                    return k !== 'hash';
                }
            )
        );
    }
}

async function checkCredentials(Email, Password) {
    let user = {};
    try {
        user = await getUserByEmail(Email);
    } catch (err) {
        console.error('Error checking credentials:', err);
    }
    const isValid = await matchPwd(user, Password);
    if (isValid) {
        return [user, true];
    }
    return [null, false];
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
        const [rows] = await connection.query(getUserByIdQuery, [id]);

        return new User(rows[0]);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

async function getUserByEmail(email) {
    try {
        const [row] = await connection.query(getUserByEmailQuery, [email]);

        return new User(row[0].user_id, row[0].username, row[0].email, row[0].password_hash, row[0].created_at, row[0].updated_at, row[0].country, row[0].city, row[0].zip_code, row[0].street_name, row[0].street_number, row[0].address_complements);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

module.exports = {User, getUsers, getUserById, getUserByEmail, checkCredentials, errDuplicateEmail, errDuplicateUsername};
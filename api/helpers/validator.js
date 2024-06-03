const Ajv = require('ajv');
const ajv = new Ajv();

const userModel = require('../schemas/new_user');
const credentials = require('../schemas/credentials');

const validateNewUser = ajv.compile(userModel);
const validateCredentials = ajv.compile(credentials);

const emailRX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gm;

class Validator {
    errors

    constructor(errors) {
        this.errors = errors;
    }

    static New() {
        const errors = new Map();
        return new Validator(errors);
    }

    add(field, message) {
        this.errors.set(field, message);
    }

    check(ok, field, message) {
        if (!ok) {
            this.add(field, message);
        }
    }

    valid() {
        return this.errors.size === 0;
    }

    output() {
        return Object.fromEntries(this.errors);
    }
}

function checkLength (data, min, max) {
    return (data.length <= max && data.length >= min);
}

function matches (data, regex) {
    return regex.test(data);
}

function notEmpty (data) {
    return data.length !== 0;
}

module.exports = {Validator, validateNewUser, validateCredentials, checkLength, matches, notEmpty, emailRX, passwordRX};
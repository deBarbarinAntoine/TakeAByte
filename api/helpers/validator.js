const Ajv = require('ajv');
const ajv = new Ajv();

const userModel = require('../schemas/new_user');
const credentials = require('../schemas/credentials');

export const validateNewUser = ajv.compile(userModel);
export const validateCredentials = ajv.compile(credentials);

export const emailRX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export const passwordRX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export class Validator {
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
        return this.errors.length === 0;
    }
}

export function checkLength(data, min, max) {
    return (data.length <= max && data.length >= min);
}

export function matches(data, regex) {
    return regex.test(data);
}

export function notEmpty(data) {
    return data.length !== 0;
}
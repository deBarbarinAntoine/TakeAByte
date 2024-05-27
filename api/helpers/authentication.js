const bcrypt = require('bcryptjs');

const saltRounds = 12;

function newHash(pwd) {
    bcrypt.hash(pwd, saltRounds, function(err, hash) {
        if (err) {
            throw err;
        }
        return hash;
    });
}

function matchPwd(user, pwd) {
    bcrypt.compare(pwd, user.hash, function(err, result) {
        if (err) {
            console.error(err);
            return false;
        }
        return result;
    });
}

module.exports = {newHash, matchPwd};
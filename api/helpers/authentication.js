const bcrypt = require('bcrypt');

const saltRounds = 12;

async function newHash(pwd) {
    return await bcrypt.hash(pwd, saltRounds);
}

async function matchPwd(user, pwd) {
    return bcrypt.compare(pwd, user.hash).then((result) => {
        return result;
    }).catch((err) => {
        console.error(`Error comparing password: ${err}`);
        return false;
    });
}

module.exports = {newHash, matchPwd};
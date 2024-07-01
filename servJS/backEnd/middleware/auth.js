const isAuthenticated = (req, res, next) => {
    // Check if the token exists in the cookies
    const token = req.cookies.token;
    req.isAuthenticated = !!token
    next();
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    req.isAuthenticated = !!token
    next();
};
const isAuth = (req, res, next) => {
    const token = req.cookies.token;
    req.isAuthenticated = !!token
    next();
};


module.exports = {requireAuth,isAuthenticated,isAuth}
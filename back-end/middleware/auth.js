const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jwt.verify(token, 'YourJWTSecretKey');
        req.userId = decoded.id;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

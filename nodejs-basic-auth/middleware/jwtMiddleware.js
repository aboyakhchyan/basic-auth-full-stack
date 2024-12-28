const jwt = require('jsonwebtoken')
require('dotenv').config()


const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' })
    }

    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid authorization format' })
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

module.exports = jwtMiddleware

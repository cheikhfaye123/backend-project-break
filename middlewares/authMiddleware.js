const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        
        return res.redirect('/login'); 
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        next(); 
    } catch (error) {
       
        return res.redirect('/login'); 
    }
};

module.exports = authMiddleware;




const adminMiddleware = (req, res, next) => {
    if (req.userInfo?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied, You are not authorized to access this resource"
        });
    }
    next();
}

module.exports = adminMiddleware;
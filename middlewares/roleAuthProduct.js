async function rolesAuth(req, res, next) {
    const user = req.user;

    const hasAdminRole = user.roles && user.roles.includes('admin');
    const hasCustomerRole = user.roles && user.roles.includes('customer');

    if (!hasCustomerRole && !hasAdminRole) {
        return res.status(403).json({ success: false, msg: "Acesso negado" });
    }
    next();
}

module.exports = rolesAuth;
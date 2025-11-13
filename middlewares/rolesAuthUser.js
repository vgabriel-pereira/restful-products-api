async function rolesAuthUser(req, res, next) {

    const userIdParam = req.params.id;

    const isAdmin = req.user.roles.includes('admin');
    const isOwner = req.user._id.toString() === userIdParam;

    if (!isAdmin && !isOwner) {
        return res.status(403).json({ success: false, msg: 'Acesso negado' });
    }

    next();

};

module.exports = rolesAuthUser;
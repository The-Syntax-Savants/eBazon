function requireUser(req, res, next)
{
    if(!req.user)
    {
        res.status(401)
        next({
            name:'MissingUserError',
            message: "You must be logged in to perform this action"
        });
    }
    next();
}


function requireAdmin(req,res,next){
    if(req.user){
        if(req.user.is_admin === false){
            res.status(401)
            next({
                name: "MissingAdminPermissionError",
                message: "You must be an admin to perform this action"
            })
        }
    }else if(!req.user){
        res.status(401)
            next({
                name: "MissingAdminPermissionError",
                message: "You must be logged into an admin account to perform this action"
            })
    }
    next()
}
module.exports = {
    requireUser,
    requireAdmin
}
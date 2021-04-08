function collaboratorAuth(req, res, next) {

    try {
        if (req.session.user.process_id != undefined) {
            next();
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        res.redirect("/login");
    }

}
module.exports = collaboratorAuth;
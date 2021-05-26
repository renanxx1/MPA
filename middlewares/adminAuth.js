
//Verifica se o usuario logado é admin ou colaborador
function adminAuth(req, res, next) {

    try {
        if (req.session.user != undefined && req.session.user.process_id == undefined) {
            next();
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        res.redirect("/login");
    }

}

module.exports = adminAuth;
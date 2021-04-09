const LoginRepository = require('../repositories/LoginRepository');
const bcrypt = require('bcryptjs');

class LoginService {

    async authenticate(req, res) {

        var adminLogin = await LoginRepository.findLoginAdmin(req.body.login);
        var collaboratorLogin = await LoginRepository.findLoginCollaborator(req.body.login);

        if (adminLogin) {
            var passwordResult = await bcrypt.compare(req.body.password, adminLogin.password);
            if (passwordResult) {
                req.session.user = {
                    id: adminLogin.id,
                    login: adminLogin.login,
                    admin: true
                }
                await LoginRepository.updateAdminSession(adminLogin.id, req.sessionID)
                return res.json({
                    result: 0
                })

            } else {
                return res.json({
                    result: 2
                })
            }

        } else if (collaboratorLogin) {
            var passwordResult = await bcrypt.compare(req.body.password, collaboratorLogin.password);
            if (passwordResult) {
                req.session.user = {
                    id: collaboratorLogin.id,
                    collaborator_name: collaboratorLogin.collaborator_name,
                    login: collaboratorLogin.login,
                    process_id: collaboratorLogin.process_id,
                    process_name: collaboratorLogin.process.dataValues.process_name,
                    admin: false
                }
                await LoginRepository.updateCollaboratorSession(collaboratorLogin.id, req.sessionID)
                return res.json({
                    login_id: collaboratorLogin.id,
                    process_name: collaboratorLogin.process.dataValues.process_name.toLowerCase()
                })

            } else {
                return res.json({
                    result: 2
                })
            }

        } else {
            return res.json({
                result: 3
            })
        }
    }
}




module.exports = new LoginService();
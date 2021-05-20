const LoginRepository = require('../repositories/LoginRepository');
const bcrypt = require('bcryptjs');

class LoginService {

    //Efetua a autenticação do usuario
    async authenticate(req, res) {
        try {
            var login = await LoginRepository.findCollaborator(req.body.login);
            if (login.admin == true) {
                var passwordResult = await bcrypt.compare(req.body.password, login.password);
                if (passwordResult && login.admin == true) {

                    req.session.user = {
                        id: login.id,
                        login: login.login,
                        admin: true
                    }

                    await LoginRepository.updateCollaboratorSession(login.id, req.sessionID);
                 
                    return res.json({
                        result: 0
                    })

                } else {
                    return res.json({
                        result: 2
                    })
                }
            } else if (login.admin == false) {
                var passwordResult = await bcrypt.compare(req.body.password, login.password);
                if (passwordResult && login.admin == false) {
                    req.session.user = {
                        id: login.id,
                        collaborator_name: login.collaborator_name,
                        login: login.login,
                        process_id: login.process_id,
                        process_name: login.process.dataValues.process_name,
                        admin: false
                    }
                  
                    await LoginRepository.updateCollaboratorSession(login.id, req.sessionID);

                    return res.json({
                        login_id: login.id,
                        process_name: login.process.dataValues.process_name.toLowerCase()
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
        } catch (error) {
            return res.json({
                result: 3
            })
        }
    }

}



module.exports = new LoginService();
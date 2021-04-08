/* const LoginRepository = require('../repositories/LoginRepository');
const bcrypt = require('bcryptjs');

class LoginService {

    async authenticate(req, login, password) {

        var adminLogin = await LoginRepository.findLoginAdmin(login);
        var collaboratorLogin = await LoginRepository.findLoginCollaborator(login);

        if (adminLogin) {
            var passwordResult = await bcrypt.compare(password, adminLogin.password);
            if (passwordResult) {
                req.session.user = {
                    id: adminLogin.id,
                    login: adminLogin.login,
                    admin: true
                }
                await LoginRepository.updateAdminSession(adminLogin.id, req.sessionID)

                return 1;

            } else {
                return 0;
            }

        } else if (collaboratorLogin) {
            var passwordResult = await bcrypt.compare(password, collaboratorLogin.password);
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
                return { login_id: collaboratorLogin.id, process_name: collaboratorLogin.process.dataValues.process_name.toLowerCase() }

            } else {
                return 0;
            }

        } else {
            return 2;
        }
    }
}

io.on("connection", async function (socket) {
    if (socket.handshake.session.user.admin == false) {
        var collaborator = await LoginRepository.findLoginCollaborator(socket.handshake.session.user.login)
        if (socket.handshake.sessionID != collaborator.session_id) {
            socket.emit("allow", false)
        } else {
            socket.emit("allow", true)
        }
    }

    socket.on('disconnect', function () {
        socket.handshake.session.user = null;
    });
})


module.exports = new LoginService(); */
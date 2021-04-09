const LoginRepository = require('../repositories/LoginRepository');
const bcrypt = require('bcryptjs');

class LoginController {

    async login(req, res) {
        res.render('login', {
            internalIp: await internalIp
        })
    }

    async logout(req, res) {
        req.session.user = null;
        res.redirect('/login')
    }

    async authenticate(req, res) {
        var login = req.body.login;
        var password = req.body.password;

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
                res.json({
                    result: 0
                })

            } else {
                res.json({
                    result: 2
                })
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
                res.json({
                    login_id: collaboratorLogin.id,
                    process_name: collaboratorLogin.process.dataValues.process_name.toLowerCase()
                })

            } else {
                res.json({
                    result: 2
                })
            }

        } else {
            res.json({
                result: 3
            })
        }
    }
}

io.on("connection", async function (socket) {

    //Caso seja um colaborador logando, dispara um evento que este colaborador esta online
    try {
        if (socket.handshake.session.user.admin == false) {
            io.emit('collaboratorOn', {
                collaborator_id: socket.handshake.session.user.id
            })
        } else if (socket.handshake.session.user.admin == true) {
            io.emit('adminOn', {
                admin_id: socket.handshake.session.user.login
            })
        }
    } catch (error) {
        return error;
    }


    //Verifica se a seção do usuario esta permitida
    socket.on('checkSession', async (data) => {
        try {
            if (socket.handshake.session.user.admin == false) {
                var collaborator = await LoginRepository.findLogin(socket.handshake.session.user.login, socket.handshake.sessionID)
                if (collaborator == null) {
                    socket.emit("allow", false)
                } else {
                    socket.emit("allow", true)
                }
            }
        } catch (error) {
            socket.emit("allow", false)
        }
    })


    //Caso o colaborador delogue, dispara um evento que este colaborador deslogou
    socket.on('disconnect', function () {
        try {
            if (socket.handshake.session.user.admin == false) {
                io.emit('collaboratorOff', {
                    collaborator_id: socket.handshake.session.user.id
                })
            }
            socket.handshake.session.user = null;
        } catch (error) {
            return error;
        }
    });
})


module.exports = new LoginController();
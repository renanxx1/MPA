const LoginRepository = require('../repositories/LoginRepository');
const LoginService = require('../services/LoginService');

class LoginController {

    async login(req, res) {
        res.render('logins/LoginIndex', {
            internalIp: await internalIp
        })
    }


    async logout(req, res) {
        req.session.user = null;
        res.redirect('/login')
    }


    async authenticate(req, res) {
        return await
        LoginService.authenticate(req, res);
    }

}


io.on("connection", async function(socket) {
    //Caso seja um colaborador logando, dispara um evento que este colaborador esta online
    try {
        if (socket.handshake.session.user.admin == false) {
            io.emit('collaboratorOn', {
                collaborator_id: socket.handshake.session.user.id
            })
        } else if (socket.handshake.session.user.admin == true) {
            io.emit('adminOn', {
                admin_login: socket.handshake.session.user.login
            })
        }
    } catch (error) {
        return error;
    }


    //Verifica se a seção do usuario esta permitida
    socket.on('checkSession', async(data) => {
        try {
            if (socket.handshake.session.user.admin == false) {
                var collaborator = await LoginRepository.findLogin(socket.handshake.session.user.login, data.session);
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
    socket.on('disconnect', function() {
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
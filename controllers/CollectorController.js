const CollectorService = require('../services/CollectorService');

class CollectorController {

    async getIndex(req, res) {
        var process = req.params.process;
        var resultProcess = process.localeCompare(req.session.user.process_name, undefined, {
            sensitivity: 'base'
        })
        //Compara o processo da seção e o processo informado na url.
        if (resultProcess == 0) {
            renderIndex(req, res);
        } else {
            res.redirect('/coletor/' + req.session.user.process_name.toLowerCase()) //Caso o usuario mude a url, sera redirecionado para o coletor do login dele
        }
    }

}


io.on("connection", async function (socket) {
    socket.on('update', (get) => {
        CollectorService.setChronometer(get.time, get.counter, get.activity_id, get.collaborator_id);
    })

    socket.on('setCounter', (get) => {
        CollectorService.setCounter(get.counter, get.process_id, get.collaborator_id);
    })

    socket.on('checkPoint', (get) => {
        CollectorService.setCheckPoint(get.activity_id);
    })

    socket.on('deleteCheckPoint', (get) => {
        CollectorService.deleteCheckPoint(get.activity_id);
    })
})


async function renderIndex(req, res) {
    var get = await CollectorService.getIndex(req, res);
    
    res.render('collectors/index', {
        activitiesAndChronometers: get.activitiesAndChronometers,
        idleTime: get.idleTime,
        collaborator: get.collaborator,
        processAndCounter: get.processAndCounter,
        mainFunction: get.mainFunction,
        groupMainActivities: get.groupMainActivities,
        groupActivities: get.groupActivities,
        checkPoint: get.checkPoint,
        internalIp: await internalIp
    })
}


module.exports = new CollectorController();
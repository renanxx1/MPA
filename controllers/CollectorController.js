const CollectorService = require('../services/CollectorService');

class CollectorController {

    async collectorIndex(req, res) {
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
        CollectorService.updateChronometer(get.time, get.counter, get.activity_id, get.collaborator_id);
    })

    socket.on('updateCounter', (get) => {
        CollectorService.updateCounter(get.counter, get.process_id, get.collaborator_id);
    })

    socket.on('checkPoint', (get) => {
        CollectorService.checkPoint(get.activity_id);
    })

    socket.on('checkPointDelete', (get) => {
        CollectorService.checkPointDelete(get.activity_id);
    })
})

async function renderIndex(req, res) {
    var get = await CollectorService.collectorIndex(req, res);
    
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
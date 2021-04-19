const CollectorRepository = require('../repositories/CollectorRepository');
const moment = require('moment');

class CollectorController {

    //FUNÇÃO PARA ATUALIZAR CRONOMETRO
    async updateChronometer(time, counter, activity_id, collaborator_id) {
        await CollectorRepository.updateChronometer(time, counter, activity_id, collaborator_id);
    }

    //FUNÇÃO PARA ATUALIZAR COUNTER
    async updateCounter(counter, process_id, collaborator_id) {
        await CollectorRepository.updateCounter(counter, process_id, collaborator_id);
    }

    async checkPoint(activity_id) {
        var chronometer = await CollectorRepository.findOneChronometer(activity_id);
        var check = await CollectorRepository.findCheckPoint(chronometer.id);

        if (check == null || check == undefined) {
            await CollectorRepository.createCheckPoint(chronometer.collaborator_id, chronometer.id);
        }
    }

    async checkPointDelete(activity_id) {
        var chronometer = await CollectorRepository.findOneChronometer(activity_id);
        await CollectorRepository.deleteCheckPoint(chronometer.id);
    }

    async collectorIndex(req, res) {
        try {
            //Consulta com os dados para a view
            var collaborator = await CollectorRepository.findCollaboratorAndProcess(req.session.user.id);
            var processAndCounter = await CollectorRepository.findProcessAndCounter(req.session.user.process_id, req.session.user.id);
            var activities = await CollectorRepository.findActivityByProcessId(req.session.user.process_id);
            var activitiesAndChronometers = await CollectorRepository.findAllActivitiesAndChronometers(req.session.user.id)
            var groups = await CollectorRepository.findGroups(req.session.user.process_id);
            var idleTime = await CollectorRepository.findIdleTime(req.session.user.id);
            var mainFunction;

            //Caso não possua cronometros ja criado nesse dia, efetua um forEach em todas atividades vinculadas a este colaborador e cria.
            if (activitiesAndChronometers[0] == null && idleTime==null) {
                for await (const activity of activities) {
                    await CollectorRepository.createChronometer("00:00:00", collaborator.work_time, 0, activity.id, collaborator.id, collaborator.process_id);
                }
                await CollectorRepository.createChronometer("00:00:00", collaborator.work_time, 0, null, collaborator.id, collaborator.process_id);
            }

            console.log(Object.keys(activities).length)
            console.log(Object.keys(activitiesAndChronometers).length)

            //Caso tenha sido inserida uma nova atividade no sistema, atualiza na pagina / Deleções permanecem até o proximo dia
            if ((Object.keys(activities).length) != Object.keys(activitiesAndChronometers).length) {
                var activitiesAndChroIds = await CollectorRepository.findAllActivitiesAndChronometersOnlyId(req.session.user.id)
                var newActivities = [];

                //Verifica se possui algum ID diferente das atividades cadastradas no banco vs ID de cronometros ja criado
                activities.forEach((first) => {
                    var find = activitiesAndChroIds.find((second) =>
                        first.id == second.activity_id
                    )
                    if (!find) newActivities.push(first);
                })

                //Cria os cronometros no banco de dados
                for await (const newActivity of newActivities) {
                    await CollectorRepository.createChronometer("00:00:00", collaborator.work_time, 0, newActivity.id, collaborator.id, collaborator.process_id);
                }
            }

            //Caso não possua contador da função principal, estara criando no BD e retornando para a view.
            if (collaborator.process.process_counter != null && processAndCounter == null) {
                await CollectorRepository.createCounter(0, collaborator.process.process_counter, collaborator.process.id, collaborator.id, collaborator.process.daily_goal);
                processAndCounter = await CollectorRepository.findProcessAndCounter(collaborator.process.id, collaborator.id);
                mainFunction = true;
            } else if (processAndCounter) {
                mainFunction = true;
            } else {
                mainFunction = false;
            }
            activitiesAndChronometers = await CollectorRepository.findAllActivitiesAndChronometers(req.session.user.id); //atualiza a variavel que envia para a view

            //Verifica se possui grupo de atividades criado
            if (groups) {
                var groupMainActivities = []; //Caso possua grupo, separa as atividades do grupo e armazena nesssas variaveis
                var groupActivities = [];

                activitiesAndChronometers.forEach((activity) => {

                    var find = groups.find(a2 =>
                        activity.createdAt == a2.group.createdAt && activity.group_id != null
                    )
                    if (find) {
                        groupMainActivities.push(activity)
                    };

                    var find2 = groups.find(a2 =>
                        activity.createdAt != a2.group.createdAt && activity.group_id != null
                    )
                    if (find2) {
                        groupActivities.push(activity)
                    };
                })
            }

            //Cria no banco de dados um checkpoint com os dados da activity, colaborador, etc.
            var check = await CollectorRepository.findCheckPointByCollaborator(req.session.user.id);
            var checkPoint = null;
            if (check != null) {
                var activityCheckPoint = await CollectorRepository.findOneActivity(check.activity_id);
                var timeSaved = await check.time;
                var newUpdateAtTime = await check.updatedAt.slice(11, 20)
                var newActualTime = await moment().format('DD/MM/YYYY HH:mm:ss').slice(11, 20)

                var timeDiff = await getTimeDiff(newUpdateAtTime, newActualTime); //Pega a diferença de tempo
                var timeFixed = await getFinalTime(timeDiff, timeSaved); //Soma a diferença de tempo com o tempo salvo no cronometro

                checkPoint = {
                    collaborator_id: await check.collaborator_id,
                    activity_id: await check.activity_id,
                    activity_name: await activityCheckPoint.activity_name,
                    group_id: await check.group_id,
                    timeFixed: await timeFixed,
                    counter: await check.counter
                };
            } else {
                checkPoint = null;
            }
            var idleTime = await CollectorRepository.findIdleTime(req.session.user.id);
          
            return {
                activitiesAndChronometers: activitiesAndChronometers,
                idleTime: idleTime,
                collaborator: collaborator,
                processAndCounter: processAndCounter,
                groupMainActivities: groupMainActivities,
                groupActivities: groupActivities,
                checkPoint: checkPoint,
                mainFunction: mainFunction
            }

        } catch (error) {
            return error;
        }
    }

}


async function getTimeDiff(time, timenow) {

    var timeS = time.split(':');
    var timenowS = timenow.split(':');

    var totalSeconds1 = (+timeS[0]) * 60 * 60 + (+timeS[1]) * 60 + (+timeS[2]);
    var totalSeconds2 = (+timenowS[0]) * 60 * 60 + (+timenowS[1]) * 60 + (+timenowS[2]);

    if (totalSeconds1 > totalSeconds2) {
        var result = totalSeconds1 - totalSeconds2;
        return new Date(result * 1000).toISOString().substr(11, 8);
    } else if (totalSeconds1 < totalSeconds2) {
        var result = totalSeconds2 - totalSeconds1;
        return new Date(result * 1000).toISOString().substr(11, 8);
    } else {
        var result = totalSeconds1 - totalSeconds2;
        return new Date(result * 1000).toISOString().substr(11, 8);
    }
}

function getFinalTime(time, timenow) {
    var timeS = time.split(':');
    var timenowS = timenow.split(':');

    var totalSeconds1 = (+timeS[0]) * 60 * 60 + (+timeS[1]) * 60 + (+timeS[2]);
    var totalSeconds2 = (+timenowS[0]) * 60 * 60 + (+timenowS[1]) * 60 + (+timenowS[2]);
    var result = totalSeconds2 + totalSeconds1;
    return new Date(result * 1000).toISOString().substr(11, 8);
}


module.exports = new CollectorController();
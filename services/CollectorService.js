const CollectorRepository = require('../repositories/CollectorRepository');
const moment = require('moment');

class CollectorService {

    //Atualiza um cronometro com os dados da atividade e colaboradaor
    async setChronometer(time, counter, activity_id, collaborator_id) {
        try {
            await CollectorRepository.setChronometer(time, counter, activity_id, collaborator_id);
        } catch (error) {
            return error;
        }
    }


    //Atualiza o countador do usuario
    async setCounter(counter, process_id, collaborator_id) {
        try {
            await CollectorRepository.setCounter(counter, process_id, collaborator_id);
        } catch (error) {
            return error;
        }
    }

    //Cria um checkpoint no sistema caso o usuario perca a conexao com uma atividade em execução
    async setCheckPoint(activity_id, collaborator_id) {
        try {

            var chronometer = await CollectorRepository.findOneChronometer(activity_id, collaborator_id);
            var check = await CollectorRepository.findCheckPoint(chronometer.id);

            if (check != null || check != undefined) {
                await CollectorRepository.deleteAllCheckPoint(collaborator_id);
                check = await CollectorRepository.findCheckPoint(chronometer.id);
            }

            if (check == null || check == undefined) {
                await CollectorRepository.createCheckPoint(chronometer.collaborator_id, chronometer.id, chronometer.process_id);
            }

        } catch (error) {
            return error;
        }
    }

    //Deleta o checkpoint criado
    async deleteCheckPoint(activity_id, collaborator_id) {
        try {
            var chronometer = await CollectorRepository.findOneChronometer(activity_id, collaborator_id);
            await CollectorRepository.deleteCheckPoint(chronometer.id);
        } catch (error) {
            return error;
        }
    }

    //Retorna os dados da pagina do coletor
    async getIndex(req) {
        try {
            //Consulta com os dados para a view
            var collaborator = await CollectorRepository.findCollaboratorAndProcess(req.session.user.id);
            var processAndCounter = await CollectorRepository.findProcessAndCounter(req.session.user.id, req.session.user.process_id);
            var activities = await CollectorRepository.findActivityByProcessId(req.session.user.process_id);
            var activitiesAndChronometers = await CollectorRepository.findAllActivitiesAndChronometers(req.session.user.id, req.session.user.process_id)
            var groups = await CollectorRepository.findGroups(req.session.user.process_id);
            var idleTime = await CollectorRepository.findIdleTime(req.session.user.id, req.session.user.process_id);

            var mainFunction;

            //Caso não possua cronometros ja criado nesse dia, efetua um forEach em todas atividades vinculadas a este colaborador e cria.
            if (activitiesAndChronometers[0] == null && idleTime == null) {
                for await (var activity of activities) {
                    await CollectorRepository.createChronometer("00:00:00", collaborator.work_time, 0, activity.id, collaborator.id, collaborator.process_id);
                }
                await CollectorRepository.createChronometer("00:00:00", collaborator.work_time, 0, null, collaborator.id, collaborator.process_id);
            }

            //Caso tenha sido inserida uma nova atividade no sistema, atualiza na pagina / Deleções permanecem até o proximo dia
            if ((Object.keys(activities).length) != Object.keys(activitiesAndChronometers).length) {
                var activitiesAndChroIds = await CollectorRepository.findAllActivitiesAndChronometersOnlyId(req.session.user.id, req.session.user.process_id)
                var newActivities = [];

                //Verifica se possui algum ID diferente das atividades cadastradas no banco vs ID de cronometros ja criado
                activities.forEach((first) => {
                    var find = activitiesAndChroIds.find((second) =>
                        first.id == second.activity_id
                    )
                    if (!find) newActivities.push(first);
                })

                //Cria os cronometros no banco de dados
                for await (var newActivity of newActivities) {
                    await CollectorRepository.createChronometer("00:00:00", collaborator.work_time, 0, newActivity.id, collaborator.id, collaborator.process_id);
                }
            }

            //Caso não possua contador da função principal, estara criando no BD e retornando para a view.
            if (collaborator.process.process_counter != null && processAndCounter == null) {
                await CollectorRepository.createCounter(0, collaborator.process.process_counter, collaborator.process.id, collaborator.id, collaborator.process.daily_goal);
                processAndCounter = await CollectorRepository.findProcessAndCounter(collaborator.id, collaborator.process.id);
                mainFunction = true;
            } else if (processAndCounter) {
                mainFunction = true;
            } else {
                mainFunction = false;
            }
            activitiesAndChronometers = await CollectorRepository.findAllActivitiesAndChronometers(req.session.user.id, req.session.user.process_id); //atualiza a variavel que envia para a view

            //Verifica se possui grupo de atividades criado
            if (groups) {
                var groupMainActivities = []; //Caso possua grupo, separa as atividades do grupo e armazena nesssas variaveis
                var groupActivities = [];

                for await (var activity of activitiesAndChronometers) {
                    var find = groups.find(a2 =>
                        activity.group_id != null && a2.group.createdAt == activity.createdAt
                    )
                    if (find) {
                        groupMainActivities.push(find)
                    };

                    var find2 = groups.find(a2 =>
                        activity.group_id != null && activity.createdAt != a2.group.createdAt
                    )
                    if (find2) {
                        groupActivities.push(activity)
                    };
                }
            }

            //Cria no banco de dados um checkpoint com os dados da activity, colaborador, etc.
            var check = await CollectorRepository.findCheckPointByCollaborator(req.session.user.id, req.session.user.process_id);
            var checkPoint = null;
            if (check != null) {
                var activityCheckPoint = await CollectorRepository.findOneActivity(check.activity_id);
                var timeSaved = await check.time;
                var newUpdateAtTime = await check.updatedAt.slice(11, 20)
                var newActualTime = await moment().format('DD/MM/YYYY HH:mm:ss').slice(11, 20)

                var timeDiff = await getTimeDiff(newUpdateAtTime, newActualTime); //Pega a diferença de tempo
                var timeFixed = await getFinalTime(timeDiff, timeSaved); //Soma a diferença de tempo com o tempo salvo no cronometro

                checkPoint = {
                    collaborator_id: check.collaborator_id,
                    process_id: check.process_id,
                    activity_id: check.activity_id,
                    activity_name: activityCheckPoint.activity_name,
                    group_id: check.group_id,
                    timeFixed: timeFixed,
                    timeDiff: timeDiff,
                    counter: check.counter
                };
            } else {
                checkPoint = null;
            }
            var idleTime = await CollectorRepository.findIdleTime(req.session.user.id, req.session.user.process_id);

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

//Função utilizada no checkpoint para pegar a diferença de tempo do ultimo dado enviado pelo colaborador e o tempo em que ele retornou ao sistema
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

//Função utilizada pelo checkpoint para pegar o tempo final
function getFinalTime(time, timenow) {
    var timeS = time.split(':');
    var timenowS = timenow.split(':');

    var totalSeconds1 = (+timeS[0]) * 60 * 60 + (+timeS[1]) * 60 + (+timeS[2]);
    var totalSeconds2 = (+timenowS[0]) * 60 * 60 + (+timenowS[1]) * 60 + (+timenowS[2]);
    var result = totalSeconds2 + totalSeconds1;
    return new Date(result * 1000).toISOString().substr(11, 8);
}


module.exports = new CollectorService();
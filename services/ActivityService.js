const ActivityRepository = require('../repositories/ActivityRepository');

class ActivityService {

    //Retorna dados para a pagina principal das atividades
    async getIndex() {
        try {
            var activities = await ActivityRepository.findAll();
            return activities;

        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de criar atividade
    async getCreate() {
        try {
            var processes = await ActivityRepository.findAllProcesses();
            var activities = await ActivityRepository.findAll();
            var groups = await ActivityRepository.findGroupAndActivity();
            return {
                processes: processes,
                groups: groups,
                activities: activities
            }

        } catch (error) {
            return error;
        }
    }

    //Cria uma atividade
    async setCreate(activityData) {
        try {
            var activityName = await ActivityRepository.findActivityByNameAndProcess(activityData.activity_name, activityData.process_id);
            if (activityName == null) { //caso o nome da atividade ja nao esteja cadastrado

                if (activityData.group_name) { //Caso o usuario envie uma atividade para vincular
                    var activityGroup = await ActivityRepository.findActivityGroupByName(activityData.group_name, activityData.process_id); //traz os dados dessa atividade
                    var group = await ActivityRepository.findGroupByName(activityData.group_name); //verifica se essa atividade ja possui grupo

                    if (group == null && activityGroup.group == null) { //cria uma atividade e um grupo
                        await ActivityRepository.createActivityAndGroup(activityData.group_name, activityData.activity_name, activityData.process_id);
                        return 1;

                    } else if (group == null && activityGroup.group.id) { //cria uma atividade e vincula a um grupo
                        await ActivityRepository.createActivitySetGroup(activityGroup.group.id, activityData.activity_name, activityData.process_id);
                        return 1;

                    } else { //cria uma atividade e vincula a um grupo
                        await ActivityRepository.createActivitySetGroup(activityGroup.group.id, activityData.activity_name, activityData.process_id);
                        return 1;
                    }

                } else { //caso o usuario nao envie uma atividade para vincular, apenas cria a atividade
                    await ActivityRepository.createActivity(activityData.activity_name, null, activityData.process_id);
                    return 1;
                }

            } else { //caso o nome da atividade ja esteja cadastrado
                return 0;
            }

        } catch (error) {
            return error;
        }
    }

    //Deleta uma atividade
    async setDelete(id) {
        try {
            var chronometerHasActivity = await ActivityRepository.findChronometer(id); //verifica se atividade ja teve cronometro criado
            if (chronometerHasActivity == null) { //caso nao tenha

                var activity = await ActivityRepository.findOneIncludeAll(id); //localiza os dados da atividade
                if (activity.group_id == null) { //verifica se a atividade esta vinculada a um grupo, caso nao esteja
                    await ActivityRepository.deleteActivity(id); //deleta
                    return 1;

                } else { //caso esteja vinculada a um grupo
                    if (activity.group.group_name == ("G_" + activity.activity_name)) { //verifica se a atividade é uma atividade principal
                        var groupHasActivity = await ActivityRepository.findActivtyByGroupId(activity.group.id); //traz todas atividades que tbm estao nesse grupo
                        if (Object.keys(groupHasActivity).length == 1) { //caso tenha apenas uma atividade
                            await ActivityRepository.deleteActivityAndGroup(id, activity.group.id); //deleta
                            return 1;

                        } else { //caso tenha mais de uma ativadade, não deleta
                            return 0;
                        }

                    } else { //caso nao seja uma atividade principal
                        await ActivityRepository.deleteActivity(id); //deleta
                        return 1;
                    }
                }

            } else { //caso a atividade ja tenha um cronometro criado
                var activity = await ActivityRepository.findOneIncludeAll(id); //localiza a atividade
                if (activity.group_id == null) { //caso o id do grupo seja null
                    await ActivityRepository.updateActivityStatus(id); //atualiza o status da atividade para desativado
                    return 1;

                } else {
                    if (activity.group.group_name == ("G_" + activity.activity_name)) { //caso seja uma atividade principal
                        var groupHasActivity = await ActivityRepository.findActivtyByGroupId(activity.group.id); //verifica se tem outras atividades no grupo
                        if (Object.keys(groupHasActivity).length == 1) { //caso tenha apenas 1 atividade no grupo
                            await ActivityRepository.updateActivityStatus(id); //atualiza o status da atividade para desativado
                            return 1;
                        } else {
                            return 0;
                        }
                    } else { //caso nao seja atividade principal
                        await ActivityRepository.updateActivityStatus(id); //atualiza o status da atividade para desativado
                        return 1;
                    }
                }
            }
        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de atualizar atividades
    async getUpdate(id) {
        try {
            var processes = await ActivityRepository.findAllProcesses();
            var groups = await ActivityRepository.findGroupAndActivity();
            var activity = await ActivityRepository.findOneIncludeAll(id);
            var activities = await ActivityRepository.findAll();
           
            if (activity == null) {
                return null;
            }

            return {
                processes: processes,
                groups: groups,
                activity: activity,
                activities: activities
            }

        } catch (error) {
            return error;
        }
    }

    //Atualiza dados da atividade
    async setUpdate(activityData) {
        try {
            var activity = await ActivityRepository.findOneIncludeAll(activityData.id); //retorna os dados da atividade
            var activityName = await ActivityRepository.findActivityNotSameId(activityData.activity_name, activityData.process_id, activityData.id); //verifica se tem uma atividade com esse nome
            var activitiesLinked = await ActivityRepository.findActivtyByGroupId(activity.group_id); //verifica se essa atividade tem um grupo e possui atividades vinculada

            console.log(activityName)
            console.log(activitiesLinked)
            //VERIFICAÇÃO DE BLOQUEIO PRINCIPAL
            //não pode cadastrar atividades com nomes iguais ou vincular a atividade em si mesma
            if (activityName != null || activity.activity_name == activityData.group_name && activity.createdAt != activity.group.createdAt) {
                return 0;
            }
            //FIM VERIFICAÇÃO DE BLOQUEIO PRINCIPAL

            //caso seja selecionado uma atividade para vincular
            if (activityData.group_name != null && activity.group_id != null) {
                var activityGroup = await ActivityRepository.findActivityGroupByName(activityData.group_name, activityData.process_id); //localiza a atividade do grupo

                //VERIFICAÇÃO DE BLOQUEIOS
                //caso seja uma atividade principal de grupo e tenha outras no mesmo grupo, não é permitido alterar o processo
                if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1 && activityData.process_id != activity.process_id) {
                    return -1;
                    //caso seja uma atividade principal de grupo e tenha outras no mesmo grupo, não é permitido vincular em outra atividade
                } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1 && activityGroup.group_id != activity.group_id) {
                    return -1;
                    //caso seja uma atividade principal de grupo e tenha outras no mesmo grupo, não é permitido deixa-la sem grupo
                } else if (activityData.group_name == null && activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length != 1) {
                    return -1;
                }
                //FIM VERIFICAÇÃO DE BLOQUEIOS

                //caso a atividade que esteja sendo editada ja possua um grupo e seja uma atividade principal e que nao tenha outras atividades vinculada
                if (activity.group_id != null && activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length == 1) {

                    //se a atividade for uma principal, e esteja trocando apenas atualizando o nome
                    if (activityGroup.group_id != null && activity.activity_name == activityData.group_name) {
                        await ActivityRepository.updateActivityAndGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                        return 1;
                    }
                    //se a atividade alvo para criar o vinculo, ja possua um grupo, delete o grupo e vincula nesse outro grupo
                    else if (activityGroup.group_id != null) {
                        await ActivityRepository.deleteGroup(activity.group_id);
                        await ActivityRepository.updateActivity(activityData.activity_name, activityGroup.group_id, activityData.process_id, activityData.id);
                        return 1;

                        //caso o alvo nao tenha grupo, deleta e cria um grupo
                    } else {
                        await ActivityRepository.deleteGroup(activity.group_id);
                        await ActivityRepository.updateActivityAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id);
                        return 1;
                    }

                    //caso seja uma atividade principal e que tenha mais de 1 atividade vinculada a ela, só é permitido alterar o nome do atividade.
                } else if (activity.group_id != null && activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {
                    await ActivityRepository.updateActivityAndGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                    return 1;

                    //caso a atividade esteja vinculada a um grupo e não seja a atividade principal
                } else if (activity.group_id != null && activity.createdAt != activity.group.createdAt) {

                    //se a atividade alvo para criar o vinculo, ja possua um grupo, delete o grupo e vincula nesse outro grupo
                    if (activityGroup.group_id != null) {
                        await ActivityRepository.updateActivity(activityData.activity_name, activityGroup.group_id, activityData.process_id, activityData.id);
                        return 1;

                        //caso o alvo nao tenha grupo, atualiza e cria um grupo
                    } else {
                        await ActivityRepository.updateActivityAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id)
                        return 1;
                    }
                }

            } else if (activityData.group_name != null && activity.group_id == null) {
                var activityGroup = await ActivityRepository.findActivityGroupByName(activityData.group_name, activityData.process_id); //localiza a atividade do grupo

                //se a atividade alvo para criar o vinculo, ja possua um grupo, delete o grupo e vincula nesse outro grupo
                if (activityGroup.group_id != null) {
                    await ActivityRepository.updateActivity(activityData.activity_name, activityGroup.group_id, activityData.process_id, activityData.id);
                    return 1;

                    //caso o alvo nao tenha grupo, atualiza e cria um grupo
                } else {
                    await ActivityRepository.updateActivityAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id)
                    return 1;
                }

                //caso nao seja selecionado uma atividade para vincular
            } else {
                //caso seja um atividade principal do grupo e nao tenha outra atividade vinculada
                if (activity.group_id != null && activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length == 1) {
                    await ActivityRepository.deleteGroup(activity.group_id);
                    await ActivityRepository.updateActivity(activityData.activity_name, null, activityData.process_id, activityData.id);
                    return 1;
                } else if (activity.group_id != null && activity.createdAt != activity.group.createdAt) {
                    await ActivityRepository.updateActivity(activityData.activity_name, null, activityData.process_id, activityData.id);
                    return 1;
                } else if (activity.group_id == null) {
                    await ActivityRepository.updateActivity(activityData.activity_name, null, activityData.process_id, activityData.id);
                    return 1;
                } else {
                    //VERIFICAÇÃO DE BLOQUEIOS
                    //caso seja uma atividade principal de grupo e tenha outras no mesmo grupo, não é permitido alterar o processo
                    if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1 && activityData.process_id != activity.process_id) {
                        return -1;
                        //caso seja uma atividade principal de grupo e tenha outras no mesmo grupo, não é permitido vincular em outra atividade
                    } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1 && activityGroup.group_id != activity.group_id) {
                        return -1;
                        //caso seja uma atividade principal de grupo e tenha outras no mesmo grupo, não é permitido deixa-la sem grupo
                    } else if (activityData.group_name == null && activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {
                        return -1;
                    }
                    //FIM VERIFICAÇÃO DE BLOQUEIOS
                }
            }
        } catch (error) {
            return error
        }
    }

}


module.exports = new ActivityService()

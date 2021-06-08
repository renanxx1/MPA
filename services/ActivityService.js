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
            return { processes: processes, groups: groups, activities: activities }

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

                    if (group == null && !activityGroup.group) { //cria uma atividade e um grupo
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
                        await ActivityRepository.updateActivityStatus(id);//atualiza o status da atividade para desativado
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

            return { processes: processes, groups: groups, activity: activity, activities: activities }

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
            var activityGroup = await ActivityRepository.findActivityGroupByName(activityData.group_name, activityData.process_id); //localiza a atividade


            //VERIFICAÇÃO PRINCIPAL: NÃO PODE CADASTRAR ATIVIDADES COM NOMES IGUAIS OU VINCULAR A ATIVIDADE EM SI MESMA
            if (activityName != null || activityData.activity_name == activityData.group_name) {
                return 0;
                //UMA ATIVIDADE PRINCIPAL DE UM GRUPO TENDO MAIS DE UMA ATIVIDADE VINCULADA NAO PODE MUDAR DE PROCESSO
            } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1 && activityData.process_id != activity.process_id) {
                return 0;
            }

           
                if (activity.group_id != null && activity.createdAt == activity.group.createdAt){

                }
/* 



                    //   if (activity.group_id == null) { 


                    //SE O ALVO NAO TIVER UM GRUPO, CRIA UM GRUPO E VINCULA
                    if (activityGroup.group == null) {
                        await ActivityRepository.updateActivityAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id);
                        return 1;
                    } else {
                        //SE POSSUI UM GRUPO, APENAS VINCULA
                        await ActivityRepository.updateActivitySetGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                        return 1;
                    }

            } else if (activityGroup.group_id != activity.group_id && activityGroup.group != null) {
                await ActivityRepository.noCheckGroupDelete(activity.group_id);
                await ActivityRepository.updateActivitySetGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                return 1;

            } else if (activityData.process_id != activity.process_id) {
                //SE O PROCESSO FOR DIFERENTE, ALTERA O PROCESSO
                await ActivityRepository.noCheckGroupDelete(activity.group_id);
                await ActivityRepository.updateActivitySetGroup(activityData.activity_name, activityData.process_id, null, activityData.id);
                return 1;
            }

        } else {
            await ActivityRepository.agroupUpdateActivityAndGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
            return 1;
        }


    } else if(activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {
    //CASO POSSUA MAIS DE UMA ATIVIDADE VINCULADA ENTRA NESSE ELSE IF

    if (activityData.process_id == activity.process_id && activityData.activity_name != activity.activity_name || activityData.activity_name == activity.activity_name && activity.group_id == activityGroup.group_id) {
        await ActivityRepository.agroupUpdateActivityAndGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
        return 1;


    } else if (activity.createdAt != activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {

        //CASO SEJA UMA ATIVIDADE NÃO PRINCIPAL DO GRUPO
        if (activityGroup.group == null) {
            await ActivityRepository.updateActivityAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id)
            return 1;

        } else {
            await ActivityRepository.updateActivitySetGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
            return 1;
        }

    }

} else if (!activityData.agroup) {

    if (activitiesLinked == undefined) {
        await ActivityRepository.noCheckActivityUpdateGroupNull(activityData.activity_name, null, activityData.process_id, activityData.id);
        return 1;

    } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length == 1) {
        await ActivityRepository.noCheckGroupDelete(activity.group_id);
        await ActivityRepository.noCheckActivityUpdateGroupNull(activityData.activity_name, null, activityData.process_id, activityData.id);
        return 1;

    } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {
        return -1;

    } else if (activity.createdAt != activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {
        await ActivityRepository.noCheckActivityUpdateGroupNull(activityData.activity_name, null, activityData.process_id, activityData.id);
        return 1;

    } else {
        await ActivityRepository.noCheckActivityUpdateGroupNull(activityData.activity_name, null, activityData.process_id, activityData.id);
        return 1;
    }
}

    } else {
    return 0;
}
    } catch (error) {
    return error;
}
}

} */


module.exports = new ActivityService()

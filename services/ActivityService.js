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
            if (activityName == null) {

                if (activityData.agroup) {
                    var activityGroup = await ActivityRepository.findActivityGroupByName(activityData.group_name, activityData.process_id)
                    var group = await ActivityRepository.findGroupByName(activityData.group_name);

                    if (group == null && !activityGroup.group) {
                        await ActivityRepository.agroupableUpdateActivityAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id);
                        return 1;

                    } else if (group == null && activityGroup.group.id) {
                        await ActivityRepository.agroupActivityAndCreate(activityGroup.group.id, activityData.activity_name, activityData.process_id);
                        return 1;

                    } else {
                        await ActivityRepository.agroupActivityAndCreate(activityGroup.group.id, activityData.activity_name, activityData.process_id);
                        return 1;
                    }

                } else {
                    await ActivityRepository.createActivity(activityData.activity_name, null, activityData.process_id);
                    return 1;
                }

            } else {
                return 0;
            }

        } catch (error) {
            return error;
        }
    }

    //Deleta uma atividade
    async setDelete(id) {
        try {
            var chronometerHasActivity = await ActivityRepository.findChronometer(id);
            if (chronometerHasActivity == null) {

                var activity = await ActivityRepository.findOneIncludeAll(id);
                if (activity.group_id == null) {
                    await ActivityRepository.deleteActivity(id);
                    return 1;

                } else {
                    if (activity.group.activityData.group_name == ("G_" + activity.activity_name)) {
                        var groupHasActivity = await ActivityRepository.findActivtyByGroupId(activity.group.id);
                        if (Object.keys(groupHasActivity).length == 1) {
                            await ActivityRepository.deleteActivityAndGroup(id, activity.group.id);
                            return 1;

                        } else {
                            return 0;
                        }

                    } else {
                        await ActivityRepository.deleteActivity(id);
                        return 1;
                    }
                }

            } else {
                var activity = await ActivityRepository.findOneIncludeAll(id);
                if (activity.group_id == null) {
                    await ActivityRepository.updateActivityStatus(id);
                    return 1;

                } else {
                    if (activity.group.activityData.group_name == ("G_" + activity.activity_name)) {
                        var groupHasActivity = await ActivityRepository.findActivtyByGroupId(activity.group.id);
                        if (Object.keys(groupHasActivity).length == 1) {
                            await ActivityRepository.updateActivityStatus(id);
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        await ActivityRepository.updateActivityStatus(id);
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
            var activity = await ActivityRepository.findOneIncludeAll(activityData.id);
            var activityName = await ActivityRepository.findActivityByNameAndProcessAndId(activityData.activity_name, activityData.process_id, activityData.id);
            var activitiesLinked = await ActivityRepository.findActivtyByGroupId(activity.group_id);

            //VERIFICAÇÃO PRINCIPAL: NÃO PODE CADASTRAR ATIVIDADES COM NOMES IGUAIS OU VINCULAR A ATIVIDADE EM SI MESMA
            if (activityName == null && activityData.activity_name != activityData.group_name) {

                if (activityData.agroup) {
                    var activityGroup = await ActivityRepository.findActivityGroupByName(activityData.group_name, activityData.process_id);

                    //SE É UMA ATIVIDADE COMUM, QUE NAO PERTENCE A GRUPO
                    if (activitiesLinked == undefined) {

                        //SE O ALVO NAO TIVER UM GRUPO, CRIA UM GRUPO E VINCULA
                        if (activityGroup.group == null) {
                            await ActivityRepository.agroupUpdateActivitiesAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id);
                            return 1;
                        } else {
                            //SE POSSUI UM GRUPO, APENAS VINCULA
                            await ActivityRepository.agroupActivityUpdate(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                            return 1;
                        }

                    } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length == 1) { //SE FOR UMA ATIVIDADE PRINCIPAL DO GRUPO E NAO POSSUIR OUTRA ATIVIDADE VINCULADA

                        //SE O NOME DA ATIVIDADE SEJA DIFERENTE OU
                        if (activityData.process_id == activity.process_id && activityData.activity_name != activity.activity_name || activityData.activity_name == activity.activity_name) {

                            //SE O GRUPO ALVO E NULL, DELETA O GRUPO ATUAL E VINCULA AO OUTRO
                            if (activityGroup.group == null) {
                                await ActivityRepository.noCheckGroupDelete(activity.group_id);
                                await ActivityRepository.agroupUpdateActivitiesAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id)
                                return 1;

                                //SE O GRUPO ATUAL E DIFERENTE DO GRUPO ALVO, DELETA O GRUPO ATUAL E VINCULA AO OUTRO
                            } else if (activityGroup.group_id != activity.group_id && activityGroup.group != null) {
                                await ActivityRepository.noCheckGroupDelete(activity.group_id);
                                await ActivityRepository.agroupActivityUpdate(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                                return 1;

                            } else {
                                await ActivityRepository.agroupUpdateActivityAndGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                                return 1;
                            }

                        } else if (activityData.process_id != activity.process_id) {
                            //SE O PROCESSO FOR DIFERENTE, ALTERA O PROCESSO
                            await ActivityRepository.noCheckGroupDelete(activity.group_id);
                            await ActivityRepository.agroupActivityUpdate(activityData.activity_name, activityData.process_id, null, activityData.id);
                            return 1;
                            //  }
                        }

                    } else if (activity.createdAt == activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {
                        //CASO POSSUA MAIS DE UMA ATIVIDADE VINCULADA ENTRA NESSE ELSE IF

                        if (activityData.process_id == activity.process_id && activityData.activity_name != activity.activity_name || activityData.activity_name == activity.activity_name && activity.group_id == activityGroup.group_id) {
                            await ActivityRepository.agroupUpdateActivityAndGroup(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
                            return 1;

                            //SE POSSUI MAIS DE UMA ATIVIDADE, NAO É POSSIVEL ALTERAR O PROCESSO OU O GRUPO, PERMITE ALTERAR APENAS O NOME DA ATIVIDADE
                        } else if (activity.group_id != activityGroup.group_id || activityData.process_id != activity.process_id) {
                            return -1;

                        } else {
                            return -1;
                        }

                    } else if (activity.createdAt != activity.group.createdAt && Object.keys(activitiesLinked).length > 1) {

                        //CASO SEJA UMA ATIVIDADE NÃO PRINCIPAL DO GRUPO
                        if (activityGroup.group == null) {
                            await ActivityRepository.agroupUpdateActivitiesAndCreateGroup(activityData.group_name, activityData.activity_name, activityData.process_id, activityData.id)
                            return 1;

                        } else {
                            await ActivityRepository.agroupActivityUpdate(activityData.activity_name, activityData.process_id, activityGroup.group_id, activityData.id);
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

}


module.exports = new ActivityService()

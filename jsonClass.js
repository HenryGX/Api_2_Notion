// 返回睡眠数据的json
function sleepInfo2Json(notionConfig,info,ymd){
    const ret = {
        parent: {
            database_id: notionConfig.database_id_sleep,
        },
        properties: {
            '日期': {
                type: 'title',
                title: [{type: 'text',text: {content: checkUndefined(ymd,"string"),},},],
            },
            '深度睡眠': {  type: 'number', number: checkUndefined(info.deepSleepSeconds,"number")},
            '清醒': {  type: 'number', number: checkUndefined(info.awakeSleepSeconds,"number") },
            '快速动眼': {  type: 'number', number: checkUndefined(info.remSleepSeconds,"number") },
            '浅睡': {  type: 'number', number: checkUndefined(info.lightSleepSeconds,"number") },
            '总睡眠时间': {  type: 'number', number: checkUndefined(info.deepSleepSeconds,"number") + 
                                                            checkUndefined(info.awakeSleepSeconds,"number") + 
                                                            checkUndefined(info.remSleepSeconds,"number") + 
                                                            checkUndefined(info.lightSleepSeconds,"number") },
            '平均呼吸次数': {  type: 'number', number: checkUndefined(info.averageRespirationValue,"number") },
            '最高呼吸次数': {  type: 'number', number: checkUndefined(info.highestRespirationValue,"number")},
            '最低呼吸次数': {  type: 'number', number: checkUndefined(info.lowestRespirationValue,"number") },
            '同步日期': { type: 'date', date: {'start':checkUndefined(info.calendarDate,"string") ,'end':null}},
        }    
    }
    return ret;
}

// 返回RSS数据的json
function rssInfo2Json(notionConfig,info,source){
    const ret = {
        parent: {
            database_id: notionConfig.database_id_rss,
        },
        properties: {
            '新闻名称': {
                type: 'title',
                title: [{type: 'text',text: {content: checkUndefined(info.title,"string"),},},],
            },
            '日期': { type: 'date', date: {'start':checkUndefined(info.isoDate,"date") ,'end':null}},
            'URL': { type: 'url', url: checkUndefined(info.link,"string") },
            "源":{ select:{ name : source }} 
        }    
    }
    return ret;
}

// 返回活动数据的json
function activitieInfo2Json(notionConfig,info,ymd){
    const ret = {
        parent: {
            database_id: notionConfig.database_id_activity,
        },
        properties: {
            '气温': { type: 'number', number: checkUndefined(info.minTemperature,"number")  },
            '用时': { type: 'number', number: checkUndefined(info.duration,"number")  },
            '最大心率': { type: 'number', number: checkUndefined(info.maxHRv,"number")  },
            '剧烈强度分钟数': { type: 'number', number: checkUndefined(info.vigorousIntensityMinutes,"number")  },
            '地点': { type: 'rich_text', rich_text: [{"text":{"content":''+checkUndefined(info.locationName,"string")}}] },
            '最大步频': { type: 'number', number: checkUndefined(info.maxRunningCadenceInStepsPerMinute,"number")  },
            '累计爬升': { type: 'number', number: checkUndefined(info.elevationGain,"number")  },
            '平均步频': { type: 'number', number: checkUndefined(info.averageRunningCadenceInStepsPerMinute,"number")  },
            '中等强度分钟': { type: 'number', number: checkUndefined(info.moderateIntensityMinutes,"number")  },
            '活动类型': { type: 'rich_text', rich_text: [{"text":{"content":''+checkUndefined(info.activityType.typeKey ,"string")}}]},
            '平均心率': { type: 'number', number: checkUndefined(info.averageHR,"number")  },
            '距离': { type: 'number', number: checkUndefined(info.distance,"number")  },
            '卡路里': { type: 'number', number: checkUndefined(info.calories,"number")  },
            '步数': { type: 'number', number: checkUndefined(info.steps,"number")  },
            '活动ID': { type: 'rich_text', rich_text: [{"text":{"content":''+checkUndefined(info.activityId,"string")}}] },
            '平均步幅': { type: 'number', number: checkUndefined(info.avgStrideLength,"number")  },
            '累计下降': { type: 'number', number: checkUndefined(info.elevationLoss,"number")  },
            '日期': { type: 'date', date: {'start':checkUndefined(info.startTimeLocal,"string") ,'end':null}},
            '活动名称': { title: [{type: 'text',text: {content: ''+checkUndefined(info.activityName,"string"),},},], }
        }    
    }
    return ret;
}

// Undefined检查
function checkUndefined(value,type){
    if (!value){
        if (type=="string"){
            return "";
        }else if (type == "number"){
            return 0;
        }else if (type == "date"){
            return new Date();
        }
    }else{
        return value;
    }
}

module.exports = {
    sleepInfo2Json,
    activitieInfo2Json,
    checkUndefined,
    rssInfo2Json,
  }
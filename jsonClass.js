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
            '深度睡眠': { id: 'WC%7Bx', type: 'number', number: checkUndefined(info.deepSleepSeconds,"number")},
            '清醒': { id: 'FAff', type: 'number', number: checkUndefined(info.awakeSleepSeconds,"number") },
            '快速动眼': { id: 'OGB%7C', type: 'number', number: checkUndefined(info.remSleepSeconds,"number") },
            '浅睡': { id: 'a%60%3Eo', type: 'number', number: checkUndefined(info.lightSleepSeconds,"number") },
            '总睡眠时间': { id: 'xKgM', type: 'number', number: checkUndefined(info.deepSleepSeconds,"number") + 
                                                            checkUndefined(info.awakeSleepSeconds,"number") + 
                                                            checkUndefined(info.remSleepSeconds,"number") + 
                                                            checkUndefined(info.lightSleepSeconds,"number") },
            '平均呼吸次数': { id: 'Q%5C%7Dx', type: 'number', number: checkUndefined(info.averageRespirationValue,"number") },
            '最高呼吸次数': { id: 'XyWb', type: 'number', number: checkUndefined(info.highestRespirationValue,"number")},
            '最低呼吸次数': { id: 'IjMz', type: 'number', number: checkUndefined(info.lowestRespirationValue,"number") },
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
            '气温': { id: '%3B%5CwG', type: 'number', number: checkUndefined(info.minTemperature,"number")  },
            '用时': { id: '%3DocJ', type: 'number', number: checkUndefined(info.duration,"number")  },
            '最大心率': { id: 'D%3FmQ', type: 'number', number: checkUndefined(info.maxHRv,"number")  },
            '剧烈强度分钟数': { id: 'EZiT', type: 'number', number: checkUndefined(info.vigorousIntensityMinutes,"number")  },
            '地点': { id: 'Frky', type: 'rich_text', rich_text: [{"text":{"content":''+checkUndefined(info.locationName,"string")}}] },
            '最大步频': { id: 'JLxv', type: 'number', number: checkUndefined(info.maxRunningCadenceInStepsPerMinute,"number")  },
            '累计爬升': { id: 'NHAI', type: 'number', number: checkUndefined(info.elevationGain,"number")  },
            '平均步频': { id: 'Y%7B%5C~', type: 'number', number: checkUndefined(info.averageRunningCadenceInStepsPerMinute,"number")  },
            '中等强度分钟': { id: '%5ET%5Dq', type: 'number', number: checkUndefined(info.moderateIntensityMinutes,"number")  },
            '活动类型': { id: 'cY_M', type: 'rich_text', rich_text: [{"text":{"content":''+checkUndefined(info.activityType.typeKey ,"string")}}]},
            '平均心率': { id: 'mljx', type: 'number', number: checkUndefined(info.averageHR,"number")  },
            '距离': { id: 'm%7CFh', type: 'number', number: checkUndefined(info.distance,"number")  },
            '卡路里': { id: 'p%3E%5Bu', type: 'number', number: checkUndefined(info.calories,"number")  },
            '步数': { id: 'tKEF', type: 'number', number: checkUndefined(info.steps,"number")  },
            '活动ID': { id: 'uc%7DL', type: 'rich_text', rich_text: [{"text":{"content":''+checkUndefined(info.activityId,"string")}}] },
            '平均步幅': { id: '%7Bm%5CI', type: 'number', number: checkUndefined(info.avgStrideLength,"number")  },
            '累计下降': { id: '%7CoUG', type: 'number', number: checkUndefined(info.elevationLoss,"number")  },
            '日期': { id: '%7Cpkp', type: 'date', date: {'start':checkUndefined(info.startTimeLocal,"string") ,'end':null}},
            '活动名称': {type: 'title',title: [{type: 'text',text: {content: ''+checkUndefined(info.activityName,"string"),},},], }
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
        }
    }else{
        return value;
    }
}

module.exports = {
    sleepInfo2Json,
    activitieInfo2Json,
    checkUndefined,
  }
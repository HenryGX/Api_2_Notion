// 返回睡眠数据的json
function sleepInfo2Json(notionConfig,info,ymd){
    const ret = {
        parent: {
            database_id: notionConfig.database_id_w,
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
  }
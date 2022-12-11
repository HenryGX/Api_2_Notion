// JSON格式化共通类
const jsonFormater = require('./jsonClass');
// 佳明lib 引用
const { GarminConnect } = require('garmin-connect');
// notion API lib 引用
const { Client } = require("@notionhq/client");
// log lib 引用
const log4js = require('log4js');
// 读取佳明配置文件
const login = require('./garmin.config.json');
// 读取Notion配置文件
const notionConfig = require('./notion-config.json');

// 日志输入
let logger = log4js.getLogger();
logger.level = 'all';

// 今天日期取得
let today = new Date(); 
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();

// 取得活动数据
const getActivitie = async () => {
    try {
        // Create a new Garmin Connect Client
        const GCClient = new GarminConnect();
        // 设定用户名密码
        await GCClient.login(login.username, login.password);
        // 获得活动数据
        // https://www.npmjs.com/package/garmin-connect
        const activities = await GCClient.getActivities(0, 5);
        
        // 遍历所有活动数据
        activities.map(data => {
            if(!data){
                logger.info('【' + today.toString() +  '】没有活动数据！');
            }else{
                // 取得活动json数据
                const bodyActivitieRate = jsonFormater.activitieInfo2Json(notionConfig,data,year + '年' + month + '月' + date + '日');
                logger.info(today.toString() +  ' 活动数据取得完成');   
                // 调用notion的api
                saveActivitie2Notion(bodyActivitieRate,data.activityId);

            }
        })

    } catch (error){
        logger.error(error.body);
    }
};

// 将睡活动据保存至notion
const saveActivitie2Notion = async (bodyActivitieRate,activityId) => {
    const notion = new Client({
        auth: notionConfig.Integration_w,
    })
    // 查询当日数据是否存在
    const response = await notion.databases.query({
        database_id: notionConfig.database_id_activity,
        "filter": {
            "property": "活动ID",
            "rich_text": {
                "contains": activityId + ''
            }
        }
        });  
    // console.log(response.results[0]); //DEBUG
    // 如果数据存在的话什么都不做
    if (!response.results[0]){
        //取得活动ID
        await notion.pages.create(bodyActivitieRate);
        logger.info(today.toString()  + '日 数据登陆成功！');
    }else{
        logger.info(today.toString() + '日 数据已经存在！');
    }
}

// 活动函数调用 
getActivitie();
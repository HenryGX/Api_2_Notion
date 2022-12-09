// 佳明lib 引用
const { GarminConnect } = require('garmin-connect');
// express lib 引用
const express = require('express');
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

// 同步匿名函数对象
const getSleep = async () => {
    try {
        // Create a new Garmin Connect Client
        const GCClient = new GarminConnect();
        // 设定用户名密码
        await GCClient.login(login.username, login.password);
        // 获得睡眠数据
        // https://www.npmjs.com/package/garmin-connect
        const sleepRate = await GCClient.getSleep(new Date(year + '-' + month + '-' + date));

        // console.log(sleepRate); //DEBUG
        if (!sleepRate){
            logger.info('【' + year + '-' + month + '-' + date + '】没有睡眠数据！');
        }else{
            //console.log(sleepRate)
            // 取得睡眠json数据
            const bodySleepRate = await new sleepInfo(sleepRate,year + '年' + month + '月' + date + '日').toJson();
            logger.info(year + '年' + month + '月' + date + '日 睡眠数据取得完成');
            // 调用notion的api
            saveSleepinfo2Notion(bodySleepRate);
        }
    } catch (error){
        logger.error(error.body);
    }
};

// 将睡眠数据保存至notion
const saveSleepinfo2Notion = async (bodySleepRate) => {
    const notion = new Client({
        auth: notionConfig.Integration_w,
    })
    // 查询当日数据是否存在
    const response = await notion.databases.query({
        database_id: notionConfig.database_id_w,
        "filter": {
            "property": "日期",
            "title": {
                "contains": year + '年' + month + '月' + date + '日'
            }
        }
        });  
    logger.info(year + '年' + month + '月' + date + '日 校验用DB数据取得完成！');
     // console.log(response.results[0]); //DEBUG
     // console.log(bodySleepRate)
    // 如果数据存在的话什么都不做
    if (!response.results[0]){
        //undefined値に「!」を作用させるとtrueが返るため、
        //これを利用するやり方もあります。しかしfalseや0もundefined扱いになってしまうので、注意が必要です。
        //const responseFromAdd = 
        await notion.pages.create(bodySleepRate);
        logger.info(year + '年' + month + '月' + date + '日 数据登陆成功！');
    }else{
        logger.info(year + '年' + month + '月' + date + '日 数据已经存在！');
    }
}

// 睡眠数据类
class sleepInfo {
    constructor(info,ymd){
        this.ymd = ymd
        // 日期
        if (!info.calendarDate){
            this.calendarDate = 0;
        }else{
            this.calendarDate = info.calendarDate;
        }
        // 深度睡眠
        if (!info.deepSleepSeconds){
            this.deepSleepSeconds = 0;
        }else{
            this.deepSleepSeconds = info.deepSleepSeconds;
        }
        // 浅睡
        if (!info.lightSleepSeconds){
            this.lightSleepSeconds = 0;
        }else{
            this.lightSleepSeconds = info.lightSleepSeconds;
        }
        // 快速动眼
        if (!info.remSleepSeconds){
            this.remSleepSeconds = 0;
        }else{
            this.remSleepSeconds = info.remSleepSeconds;
        }
        // 清醒
        if (!info.awakeSleepSeconds){
            this.awakeSleepSeconds = 0;
        }else{
            this.awakeSleepSeconds = info.awakeSleepSeconds;
        }
        // 平均呼吸次数
        if (!info.averageRespirationValue){
            this.averageRespirationValue = 0;
        }else{
            this.averageRespirationValue = info.averageRespirationValue;
        }
        // 最低呼吸次数
        if (!info.lowestRespirationValue){
            this.lowestRespirationValue = 0;
        }else{
            this.lowestRespirationValue = info.lowestRespirationValue;
        }
        // 最高呼吸次数
        if (!info.highestRespirationValue){
            this.highestRespirationValue = 0;
        }else{
            this.highestRespirationValue = info.highestRespirationValue;
        }
    }
    toJson(){
        const ret = {
            parent: {
                database_id: notionConfig.database_id_w,
            },
            properties: {
                '日期': {
                    type: 'title',
                    title: [{type: 'text',text: {content: this.ymd,},},],
                },
                '深度睡眠': { id: 'WC%7Bx', type: 'number', number: this.deepSleepSeconds},
                '清醒': { id: 'FAff', type: 'number', number: this.awakeSleepSeconds },
                '快速动眼': { id: 'OGB%7C', type: 'number', number: this.remSleepSeconds },
                '浅睡': { id: 'a%60%3Eo', type: 'number', number: this.lightSleepSeconds },
                '总睡眠时间': { id: 'xKgM', type: 'number', number: this.awakeSleepSeconds+this.remSleepSeconds+this.deepSleepSeconds+this.lightSleepSeconds },
                '平均呼吸次数': { id: 'Q%5C%7Dx', type: 'number', number: this.averageRespirationValue },
                '最高呼吸次数': { id: 'XyWb', type: 'number', number: this.highestRespirationValue},
                '最低呼吸次数': { id: 'IjMz', type: 'number', number: this.lowestRespirationValue },
            }    
        }
        return ret;
    }
}

// 睡眠函数调用 
getSleep();


// JSON格式化共通类
const jsonFormater = require('./jsonClass');
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
            const bodySleepRate = jsonFormater.sleepInfo2Json(notionConfig,sleepRate,year + '年' + month + '月' + date + '日');
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

// 睡眠函数调用 
getSleep();


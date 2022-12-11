// JSON格式化共通类
const jsonFormater = require('./jsonClass');
// RSS源读取lib 引用
const Parser = require('rss-parser');
// notion API lib 引用
const { Client } = require("@notionhq/client");
// 读取Notion配置文件
const notionConfig = require('./notion-config.json');
// 读取RSS FEEDS文件
const feeds = require('./rss-feed-config.json');
// log lib 引用
const log4js = require('log4js');
// 日志输入
let logger = log4js.getLogger();
logger.level = 'all';

// 今天日期取得
let today = new Date(); 
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();

const reader = async () => {
    try{
        // 遍历源，取得源内容并登陆notion
        feeds.map(feed =>{ rss2Notion(feed); })
        logger.info(year + '年' + month + '月' + date + '日 RSS数据取得完成');
    } catch (error){
        logger.error(error.body);
    }
}

const rss2Notion = async (feed) => {
    // RSS对象
    const parser = new Parser();
    let rssRet = await parser.parseURL(feed.url);
    //源名称取得
    const tilte = rssRet.title;
    rssRet.items.map(rss => {
        sve2Notion(rss,tilte);
    })
    logger.info(today.toString() + ' ['+ feed.title + ']数据取得完成');
}

const sve2Notion = async (rss,tilte) =>{
    const notion = new Client({
        auth: notionConfig.Integration_w,
    })
    // 查询当前新闻是否存在
    const response = await notion.databases.query({
        database_id: notionConfig.database_id_rss,
        "filter": {
            "property": "新闻名称",
            "title": {
                "contains": rss.title
            }
        }
        });  
    // 结果确认
    //console.log(response.results[0].properties);
    // 如果数据不存在登陆新闻
    if(!response.results[0]){
        const bodyRss = jsonFormater.rssInfo2Json(notionConfig,rss,tilte);
        await notion.pages.create(bodyRss);
        logger.info(today.toString() +  ' [源]' + tilte + ' ['+ rss.title + '] 数据登陆成功！');
    }else{
        //logger.info(year + '年' + month + '月' + date + '日 [源]' + tilte + ' ['+ rss.title + '] 数据已经存在！');
    }
}

reader();
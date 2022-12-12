// notion API lib 引用
const { Client } = require("@notionhq/client");
// log lib 引用
const log4js = require('log4js');
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

const notion = new Client({
    auth: notionConfig.Integration_w,
})

//  查找旧新闻数据（15天之前的新闻）
const rssDeleteFromNotion = async (bodySleepRate) => {
    const response = await notion.databases.query({
        database_id: notionConfig.database_id_rss,
        "filter": {
            "property": "天数",
            "formula": {
                number:{
                    "less_than": -15
                }
            }
        }
        });  
        // 遍历结果数据并删除
        response.results.map(rss => {
            deleteRss(rss)
        })
        logger.info(today.toString() +  ' 删除了15天之前的RSS新闻数据!');
}

// 删除处理
const deleteRss = async (rss) => {
    await notion.blocks.delete({
        block_id: rss.id,
    });
}
// 删除旧新闻 
rssDeleteFromNotion();
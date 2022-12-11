// JSON格式化共通类
const jsonFormater = require('./jsonClass');
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

// 文件读写lib 用来保存token.json文件
// 通过自动启动浏览器验证后，自动生成token.json
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
// google 验证用lib
const {authenticate} = require('@google-cloud/local-auth');
// google API lib
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('没有找到日历信息！');
    return;
  }
  console.log('获取最近50条信息！');
  events.map((event, i) => {
    const start =event.start.dateTime || event.start.date
    const end =event.end.dateTime || event.end.date
    event.start.dateTime = start.substring(0, 10);
    event.end.dateTime = end.substring(0, 10);
    saveCalInfo2Notion(event);
  });
}

// 将睡眠数据保存至notion
const saveCalInfo2Notion = async (event) => {
    const notion = new Client({
        auth: notionConfig.Integration_w,
    })
    // 查询当日数据是否存在
    const response = await notion.databases.query({
        database_id: notionConfig.database_id_google_cal,
        "filter": {
            "property": "CALID",
            "rich_text": {
                "contains": event.id + ''
            }
        }
        });  
    logger.info(today.toString() +  ' 校验用DB数据取得完成！');
    //console.log(response.results[0].properties.总睡眠时间.number); //DEBUG
    // 如果数据存在的话什么都不做
    if (!response.results[0]){
        // 取得活动json数据
        const calRet = jsonFormater.calInfo2Json(notionConfig,event);
        // 登陆到notion
        await notion.pages.create(calRet);
        logger.info(today.toString() +  ' google日历数据登陆成功！');
    }else{
        logger.info(today.toString() + ' google日历数据已经存在！');
    }
}

authorize().then(listEvents).catch(console.error);
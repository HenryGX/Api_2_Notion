# Api_2_Notion

## 愿景
希望打造一个通过NOTION API把各种数据导入NOTION的集合库。

## 已经实现机能
1.佳明手表的睡眠数据同步
2.佳明手表的活动数据同步
3.主页

## TODO list
- RSS 订阅数据导入
- Google日历导入
- index.html（各个机能的手动执行按钮）
- 代码整理

## 请下载如下NOTION模版
[睡眠数据模版](https://intriguing-wrinkle-d17.notion.site/814baac3140b48368ba162d25f401a3b?v=3bc4fca2bca24524a8eca1b91f14bb16)

[活动数据模版](https://intriguing-wrinkle-d17.notion.site/7a1032ab6abe4a6e86cc9ea8dc6749c9?v=0f742529531241439f71423490e1cd05)


## 环境构筑

1.申请集成TOKEN [去申请](https://www.notion.so/my-integrations)
![avatar](/help/img/申请集成TOKEN.png)

2.将建立好的集成TOKEN添加至上面两个模版中 点击右上角三个点
![avatar](/help/img/集成TOKEN关联.png)

3.确认数据库模版ID 点击右上角共享
![avatar](/help/img/数据模版ID确认.png)

4.CLONE本代码至本地路径

5.安装NODEJS运行环境（请自行安装）

6.安装依赖库

```shell
npm install express
npm install garmin-connect
npm install log4js
npm install @notionhq/client
```

7.配置

佳明的账户密码 ： garmin.config.json 
notion数据库ID设置：notion-config.json 
- 将notion的集成TOKEN设置到"Integration_w"
- 将睡眠模版的ID设置到"database_id_sleep"
- 将活动模版的ID设置到"database_id_activity"

8.手动执行

- 访问地址：localhost1:8080
  - node home.js (开启WEB服务) 
  - 
- 当日睡眠数据取得
  - node garminSleepInfo.js 
  - 
- 取得最新运动数据默认最近一天（想要取得最近50条运动的数据的话，请修改33行 改成(0, 50)即可）
  - node garminActivitieInfo.js 

用法：

配合树莓派，香橙派等集成电脑建立自己的小型家庭服务器！！！
本人使用香橙派安装ubentu，使用crontab计划任务功能，实现定时同步睡眠数据跟活动数据的功能。只要在服务器电脑上重复上述步骤4～8安装运行环境即可。
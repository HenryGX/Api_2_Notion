const express = require('express');
const server = express();
//设置静态页面目录
server .use(express.static('home'));
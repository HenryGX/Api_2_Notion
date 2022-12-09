const express = require('express');
const server = express();
//设置静态页面目录
server.use(express.static('public'));

server.get("/",function (request,response){
    
})

server.listen(8080)
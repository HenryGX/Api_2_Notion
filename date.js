Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// 今天日期取得
let start = new Date(); 
start = start.addDays(-100);
let start_year= start.getFullYear();
let start_month = start.getMonth() + 1;
let start_date = start.getDate();

let today = new Date(); 
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();

let loop = new Date(start);
while (loop <= today) {
    console.log(loop);
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }
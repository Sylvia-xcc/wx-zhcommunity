//计算两个时间戳之间相差多少时间
function formatTime2(start_time, end_time) {
  var start_time = start_time; //开始时间
  var end_time = end_time; //结束时间
  if (end_time <= start_time)
    return "活动结束";
  var usedTime = Math.floor((end_time - start_time) / 1000); //两个时间戳相差的毫秒数  
  var days = Math.floor(usedTime / (24 * 3600));
  usedTime = usedTime % (24 * 3600);
  var hours = Math.floor(usedTime / 3600);
  usedTime = usedTime % 3600;
  var minutes = Math.floor(usedTime / 60);
  var second = Math.floor(usedTime % 60);

  return format(days) + "天" + format(hours) + "时" + format(minutes) + "分" + format(second) + "秒";
}

function formatTime(start_time, end_time) {
  var start_time = start_time; //开始时间
  var end_time = end_time; //结束时间
  if (end_time <= start_time)
    return ["00", "00", "00", "00"];
  var usedTime = Math.floor((end_time - start_time) / 1000); //两个时间戳相差的毫秒数  
  var days = Math.floor(usedTime / (24 * 3600));
  usedTime = usedTime % (24 * 3600);
  var hours = Math.floor(usedTime / 3600);
  usedTime = usedTime % 3600;
  var minutes = Math.floor(usedTime / 60);
  var second = Math.floor(usedTime % 60);

  return [format(days), format(hours), format(minutes), format(second)];
}

/**
 * 时间换算
 * xx天00：00：00
*/
function formatTime3(start_time, end_time) {
  let times = formatTime(start_time, end_time);
  return times[0] + "天" + times[1] + ":" + times[2] + ":" + times[3];
}

/**
 * 格式化小于10的数字
 * @param {Number} time - 小于10的数字
 * @returns {string} 格式化后的字符串
 */
function format(time) {
  return time >= 10 ? time : '0' + time;
}

/**
 * 将标准时间转化为时间戳
 * @param time-'2018-09-11 13:50:52'
 * @return 时间戳
*/
function formatTime5(time) {
  var thisTime = time;
  thisTime = thisTime.replace(/-/g, '/');
  var timestamp = new Date(thisTime);
  timestamp = timestamp.getTime();
  return timestamp;
}

/**标准时间转化为时间戳*/
function dateToMs(date) {
  let result = new Date(date).getTime();
  return result;
}

/**时间戳转标准时间 */

function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  format: format,
  dateToMs: dateToMs,
  formatTimeTwo: formatTimeTwo
}
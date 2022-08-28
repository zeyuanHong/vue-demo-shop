/** 
 * @param date string 时间戳或者日期对象字符串
 * @param format string 转换的日期格式
 * 
*/

function formatNum(num){// 封装单个数字前面补0的方法。
  return String(num).length>1?num:"0"+num
}

export function formatDate(dateStr, format="YYYY-MM-DD"){
  var date = dateStr ? new Date(dateStr) : new Date();// 三步运算,？前面为true执行:前面的语句，false执行:后面的语句。
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minutes = date.getMinutes()
  var second = date.getSeconds()
  const DATE_MAP={ // 把format中字符串的字符和日期做成对象对应
    YYYY: year,
    MM: formatNum(month),
    DD: formatNum(day),
    hh: formatNum(hour),
    mm: formatNum(minutes),
    ss: formatNum(second),
    YY: String(year).slice(2),  // 从索引2开始截取字符串
  }
  Object.keys(DATE_MAP).forEach(function(key){ // 遍历DATE_MAP,如果键在字符串里面出现，则把对应的值替换为键。
    format = format.replace(key, DATE_MAP[key])
  })
  return format
}
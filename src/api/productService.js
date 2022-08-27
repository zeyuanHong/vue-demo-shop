import api from "./api";
import {GET, POST} from "./axios";

// 发送具体的请求需要单独放入js文件。
export function getPro(data,callback){
  POST(api.getPro,data,callback)
}

// 根据商品id获取商品数据
export function getDetail(data,callback){
  GET(`${api.getDetail}?id=${data.id}`,callback)
}


import api from "./api";
import {GET,POST} from "./axios";

// 发送具体的请求需要单独放入js文件。
export function getBanner(callback){
  GET(api.getBanner,callback)
}

export function getAllProType(callback){
  GET(api.getAllProType,callback)
}

export function addDetailImg(data,callback){
  POST(api.adddetailimg,data,callback)
}

export function delDetailImg(data,callback){
  POST(api.deldetailimg,data,callback)
}




import api from "./api"
import { POST, GET } from "./axios"

export function createOrder(data, callback) {
    POST(api.createOrder, data, callback)
}

export function payOrder(data, callback) {
    POST(api.payOrder, data, callback)
}

export function getOrders(data, callback) {
    POST(api.getOrders, data, callback)
}

export function delOrder(data, callback) {
    GET(`${api.delOrder}?orderId=${data.orderId}`, callback)
}

export function confirmOrder(data, callback) {
    GET(`${api.confirmOrder}?orderid=${data.orderid}`, callback)
}

export function updateOrders(data, callback) {
    POST(api.updateOrders, data, callback)
}

export function saveArticle(data, callback) {
    POST(api.saveArticle, data, callback)
}

export function updateOrderProlist(data, callback) {
    POST(api.updateOrderProlist, data, callback)
}
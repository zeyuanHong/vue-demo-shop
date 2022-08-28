const baseUrl = "/"
const staticUrl = "https://8i98.com/apidoc"
export default {
  getBanner: `${baseUrl}dapi/vapi/getBanner`, //获取banner图片
  getAllProType: `${baseUrl}dapi/vapi/getAllProType`, //获取产品分类数据
  getPro: `${baseUrl}dapi/vapi/getPro`, //获取产品
  getDetail: `${baseUrl}dapi/vapi/getDetail`, //获取商品
  login: `${baseUrl}dapi/vapi/login`, //用户登录
  register: `${baseUrl}dapi/vapi/register`, //用户注册
  profile: `${baseUrl}dapi/vapi/profile`, //个人信息
  adddetailimg: `${baseUrl}dapi/vapi/adddetailimg`, //添加图片
  deldetailimg: `${baseUrl}dapi/vapi/deldetailimg`, //删除图片
  updateavatar: `${baseUrl}dapi/vapi/updateavatar`, //更新用户头像
  updateProfile: `${baseUrl}dapi/vapi/updateProfile`, //更新用户信息
  saveMoney: `${baseUrl}dapi/vapi/saveMoney`, //充值
  createOrder: `${baseUrl}dapi/vapi/createOrder`, //创建订单
  payOrder: `${baseUrl}dapi/vapi/payOrder`, //付款
  getOrders: `${baseUrl}dapi/vapi/getOrders`, //获取订单
  delOrder: `${baseUrl}dapi/vapi/delOrder`, //删除订单
  updateOrders: `${baseUrl}dapi/vapi/updateOrders`, //更新订单信息
  confirmOrder: `${baseUrl}dapi/vapi/confirmOrder`, //确认收货
  saveArticle: `${baseUrl}dapi/vapi/saveArticle`, //保存评论
  updateOrderProlist: `${baseUrl}dapi/vapi/updateOrderProlist` //更新订单评价数据
}
export { staticUrl }
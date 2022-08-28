<template>
    <div v-show="!showDetail">
        <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" fixed placeholder />
        <van-list :immediate-check="false" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
            @load="onLoad">
            <div class="order-con" v-for="(item, index) in orderList" :key="index">
                <dl class="order-dl">
                    <dt>{{ formatDateStr(item.createtime) }}</dt>
                    <dd>
                        <van-tag type="primary">{{ ORDER_STATUS[item.status] }}</van-tag>
                    </dd>
                </dl>
                <van-card v-for="(obj, index) in JSON.parse(item.prolist)" :num="obj.num" :price="obj.price"
                    :title="obj.title" :thumb="staticUrl + '/' + obj.img" :key="index" />
                <p class="txt-r">
                    <van-button type="primary" size="mini" @click="selectOrder(item)">查看详情</van-button>
                    <van-button @click="handleDelOrder(item.orderid, index)"
                        v-if="item.status === 0 || item.status === 3" type="danger" size="mini">删除订单</van-button>
                </p>
            </div>
        </van-list>
    </div>
    <div v-show="showDetail" class="order-detail">
        <orderdetail :hideCom="hideOrderDetail" :data="this.selectOrderData" :changeOrderStatus="changeOrderStatus" />
    </div>
</template>

<script>
import { Dialog } from "vant"
import { staticUrl } from "../../api/api"
import { getOrders, delOrder } from "../../api/orderService"
import { formatDate } from "../../util/tool"
import { ORDER_STATUS } from "../../config/index"
export default {
    name: 'Order',
    data() {
        return {
            staticUrl,
            orderList: [],
            ORDER_STATUS,
            loading: false, // 分页加载状态
            finished: false, // 是否可以分页
            page: 1, // 分页变量
            showDetail: false, // 显示订单详情
            selectOrderData: {}, // 查看详情的订单数据对象
        }
    },

    mounted() {
        this.init()
        
        
    },

    methods: {
        init() {
            getOrders({ page: this.page }, (res) => {
                // 获取用户订单数据
                let data = res.data[0].data;
                if (data.length === 10) {
                    // 如果返回的数据长度等于10，表示可能有分页数据。
                    this.page++;
                } else {
                    // 如果返回数据长度小于10，表示没有分页，则不需要触发分页函数。
                    this.finished = true
                }
                this.orderList = [...this.orderList, ...data]
                this.loading = false
            })
        },

        formatDateStr(str) {
            // 格式化时间显示
            return formatDate(str);
        },
        onLoad() {
            // 分页事件
            this.loading = true;
            this.init();
        },

        handleDelOrder(orderId, index) {
            // 删除订单,需要有提示框，不能直接调删除接口
            Dialog.confirm({
                title: "",
                message: "确认需要删除订单?删除后无法回复。",
            })
                .then(() => {
                    delOrder({ orderId }, (res) => {
                        if (res.success) {
                            // 后端删除成功，前端对应的数据需要删除。
                            this.orderList.splice(index, 1);
                            this.orderList = [...this.orderList]; //需要重新给orderList赋值才能触发更新。
                        }
                    })
                })
                .catch(() => {

                })
        },

        hideOrderDetail() { // 隐藏查看订单详情
            this.showDetail = false;
        },
        selectOrder(data) { // 查看订单详情
            this.selectOrderData = data;
            this.showDetail = true;
        },

        changeOrderStatus(orderid, key, value) { // 修改当前订单的任意字段值
            for (let i = 0; i < this.orderList.length; i++) {
                if (this.orderList[i].orderid === orderid) {
                    this.orderList[i][key] = value;
                    this.orderList = [...this.orderList];
                    break;
                }
            }
        }
    },
}
</script>

<style lang="scss">
.txt-r {
    text-align: right;
    padding-right: 10px;
}

.order-detail {
    .van-nav-bar__placeholder {
        height: 46px;
    }

    .van-submit-bar__button {
        display: none;
    }

    .van-popup--center {
        width: 90%;
    }
}

.order-dl {
    display: flex;
    margin: 0;
    justify-content: space-around;
    align-items: center;

    &>dd {
        margin: 0;
        text-align: right;
    }
}

.order-con {
    background-color: #fff;
    margin: 15px 0;
    padding: 10px 0;

    .van-card {
        background-color: #fff;
    }
}
</style>
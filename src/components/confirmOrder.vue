<template>
    <van-nav-bar title="确认订单" left-arrow @click-left="hideCom('cart')" fixed placeholder />
    <van-card v-for="(item, index) in selectPro" :num="item.num" :price="item.price" :title="item.title"
        :thumb="staticUrl + '/' + item.img" :key="index" />
    <div class="content">
        <dl class="dl">
            <dt>收货人:</dt>
            <dd>{{ address.name }}</dd>
        </dl>
        <dl class="dl">
            <dt>收货电话:</dt>
            <dd>{{ address.tel }}</dd>
        </dl>
        <dl class="dl">
            <dt>收货地址:</dt>
            <dd>{{ getAddress }}</dd>
        </dl>
    </div>
    <van-submit-bar :price="price" button-text="付款" @submit="onPayOrder" />
    <!-- 支付成功后跳出来的内容 -->
    <van-popup v-model:show="show" :close-on-click-overlay="false">
        <div class="success">
            <van-icon name="passed" color="green" size="100" />
            <h3>支付成功</h3>
            <p class="p-15">
                <van-button type="primary" @click="$router.push('/')" block>返回首页</van-button>
            </p>
            <p class="p-15">
                <van-button type="success" @click="$router.push('/order')" block>查看订单</van-button>
            </p>
        </div>
    </van-popup>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { staticUrl } from '../api/api'
import { createOrder, payOrder } from "../api/orderService"
export default {
    name: "ConfirmOrder",
    props: ["selectPro", "price", "hideCom", "address", "checked"],
    data() {
        return {
            staticUrl,
            show: false
        }
    },

    computed: {
        ...mapGetters('user', ['getProfile', 'cartData']),

        getAddress() { // 收货地址
            return `${this.address.province} ${this.address.city} ${this.address.county} ${this.address.addressDetail}`
        },
        getProIdList() { // 获取商品id的数组
            let data = this.selectPro.map((item) => item.id);
            return data.join(","); // 把数组以,分割为字符串。
        }
    },

    methods: {
        ...mapActions('user', ['setProfileAction']),

        onPayOrder() { // 点击付款按钮，先调用创建订单的接口，获取到订单编号才能去支付
            let price = this.price / 100 //得到正常的价格
            createOrder({ //需要的参数
                allprice: price,
                prolist: JSON.stringify(this.selectPro),
                status: 0, //订单状态,0未付款，1已付款，2已发货，3已收货
                address: `${this.address.name},${this.address.tel}, ${this.getAddress}`,
                idlist: this.getProIdList //商品id,多个商品id用,分割
            }, (res) => {
                let orderid = res.data[1].id;// 获取后端返回的订单id号
                payOrder({
                    orderid,
                    money: price
                }, (res) => {
                    this.show = true
                    // 删除购物车数据里面已经付款的商品
                    for (let i = 0; i < this.cartData.length; i++) {
                        let item = this.cartData[i]
                        if (this.checked.includes(item.id + "-" + item.color + "-" + item.size)) {
                            this.cartData.splice(i, 1)
                            i--
                        }
                    }
                    this.setProfileAction({ // 付款成功需要修改全局状态里用户的金额
                        data: {
                            ...this.getProfile,
                            mymoney: this.getProfile.mymoney - price,
                            shoppingcart: JSON.stringify(this.cartData)
                        }
                    })
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
// 给顶部确认收货设置固定高度
.van-nav-bar__placeholder {
    height: 46px;
}

.p-15 {
    padding: 0 15px;
}

.success {
    text-align: center;
}

.content {
    margin-top: 10px;
    background-color: #fff;
    padding: 15px;
}

.dl {
    display: flex;
    margin: 5px 0;
    padding: 0 10px;

    &>dt {
        width: 100px;
    }

    &>dd {
        margin: 0;
        flex: 1;
    }
}
</style>
<template>
    <van-nav-bar @click="getData" title="商品详情" left-arrow @click-left="$router.go(-1)" fixed placeholder />
    <!-- 商品展示大图 -->
    <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="image in images" :key="image">
            <img class="imgw" :src="staticUrl + '/' + image" />
        </van-swipe-item>
    </van-swipe>
    <!-- 参数 -->
    <div class="title">
        <h1>{{ data.title }}</h1>
        <!-- 有brand就展示 -->
        <p v-if="data.brand">{{ data.brand }}</p>
        <span>￥{{ (data.price * data.discount / 10).toFixed(2) }}</span>
        <del style="margin-left:.15rem;">￥{{ data.price }}</del>
    </div>
    <!-- 规格 -->
    <div class="container">
        <dl class="dl" v-if="color" @click="showPicker = true">
            <dt>颜色:</dt>
            <dd>{{ selectColor }}</dd>
            <dd>
                <van-icon name="arrow" />
            </dd>
        </dl>
        <dl class="dl" v-if="size" @click="showSize = true">
            <dt>尺寸:</dt>
            <dd>{{ selectSize }}</dd>
            <dd>
                <van-icon name="arrow" />
            </dd>
        </dl>
    </div>

    <!-- 销量和库存 -->
    <div class="container">
        <dl class="dl">
            <dt>销量:</dt>
            <dd>{{ data.sales }}</dd>
            <dd></dd>
        </dl>
        <dl class="dl">
            <dt>库存:</dt>
            <dd>{{ data.stock }}</dd>
            <dd></dd>
        </dl>
    </div>

    <!-- 用户评价 -->
    <div class="container">
        <dl class="dl article-dl">
            <dt>用户评价</dt>
            <dd><span>查看全部</span>
                <van-icon name="arrow" />
            </dd>
        </dl>
        <dl class="article">
            <dt>
                <div>
                    <img src="../../assets/images/头像.jpg">
                    <span>哲理源</span>
                </div>
                <p>非常好用的一款产品</p>
            </dt>
            <dd>2022-02-02</dd>
        </dl>
        <dl class="article">
            <dt>
                <div>
                    <img src="../../assets/images/头像.jpg">
                    <span>哲理源</span>
                </div>
                <p>还不错</p>
            </dt>
            <dd>2022-02-02</dd>
        </dl>
    </div>


    <div class="container details" v-html="detail">
    </div>

    <!-- 底部 -->
    <div class="footer-placholder"></div>
    <div class="footer">
        <div>
            <span class="iconfont icon-zixun"></span>
            <p>咨询</p>
        </div>
        <div>
            <span class="iconfont icon-31shoucang"></span>
            <p>收藏</p>
        </div>
        <div @click="$router.push('/cart?id=detail')">
            <van-badge :content="cartNum" max="90">
            <span class="iconfont icon-gouwuche"></span>
            <p>购物车</p>
            </van-badge>
        </div>
        <div @click="addCart">
            加入购物车
        </div>
    </div>

    <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker v-if="color" :columns="color" @cancel="showPicker = false" @confirm="onConfirmColor" />
    </van-popup>
    <van-popup v-model:show="showSize" round position="bottom">
        <van-picker v-if="size" :columns="size" @cancel="showPicker = false" @confirm="onConfirmSize" />
    </van-popup>
</template>

<script>
import { staticUrl } from "../../api/api"
import { getDetail } from "../../api/productService"
import { updateProfile } from "../../api/userServer"
import { mapGetters, mapActions } from "vuex"
import { Notify } from "vant"
export default {
    name: 'Detail',
    props: ['id'],
    data() {
        return {
            staticUrl,
            data: {},
            showPicker: false,
            showSize: false,
            selectColor: '',
            selectSize: '',
        }
    },
    computed: {
        ...mapGetters('user', ['getProfile', 'cartNum']),
        // 取出商品的大图
        images() {
            return this.data.img?.split(',') || []
        },

        // 取出商品的颜色
        color() {
            let data = this.data.color?.split(",");
            if (data) {// 如果有color数据则默认显示第一个颜色
                this.selectColor = data[0];
            }
            return data;
        },

        // 取出商品的尺寸
        size() {
            let data = this.data.size?.split(",");
            if (data) {// 如果有size数据则默认显示第一个尺寸
                this.selectSize = data[0];
            }
            return data;
        },

        detail() { // 计算商品详情，给img添加静态服务器地址
            let detail = this.data.detail;
            let reg = /src="\/apidoc\/vapi/g;
            detail = detail?.replace(reg, `src="${staticUrl}/vapi`) || ""
            return detail;
        }
    },
    mounted() {
        this.getProDetail()
    },
    methods: {
        ...mapActions('user',['setProfileAction']),
        
        getProDetail() {
            // console.log(this.id)
            getDetail({ id: this.id }, (res) => {
                // console.log(res)
                this.data = res.data[0].data[0]
            })
        },
        getData() {
            console.log(this.data)
        },

        onConfirmColor(value) {
            this.selectColor = value;
            this.showPicker = false;
        },
        onConfirmSize(value) {
            this.selectSize = value;
            this.showSize = false;
        },

        // 点击加入购物车
        addCart() {
            // 把商品加入购物车，购物车数据是一个数组，需要存入用户信息的shoppingcart
            // 1. 读取用户的购物车数据
            let { shoppingcart } = this.getProfile
            // 2. 如果用户该字段有值，则需要转为js对象
            if (shoppingcart) {
                shoppingcart = JSON.parse(shoppingcart)
            } else {
                shoppingcart = []
            }

            // 3. 商品id,颜色，尺寸相同的则为同一商品，不能直接追加到购物，只是让其num递增1.
            let inCart = false; // 商品是否已经加入购物车
            for (let i = 0; i < shoppingcart.length; i++) {
                let obj = shoppingcart[i]
                if (obj.id === this.data.id && obj.color === this.selectColor && obj.size === this.selectSize) {
                    shoppingcart[i].num++
                    inCart = true
                    break
                }
            }

            // 4. 像购物车字段添加商品数据
            if (!inCart) {
                shoppingcart.push({
                    id: this.data.id,
                    title: this.data.title,
                    img: this.images[0],
                    price: (this.data.price * this.data.discount / 10).toFixed(2),
                    num: 1,
                    color: this.selectColor,
                    size: this.selectSize,
                    createTime: new Date().getTime()
                })
            }

            //5. 把购物车数据更新到后端全局状态也要更新
            updateProfile({
                filedname: "shoppingcart",
                filedvalue: JSON.stringify(shoppingcart)
            }, () => {
                Notify({ type: "success", message: "添加成功!" })
                this.setProfileAction({
                    data: { ...this.getProfile, shoppingcart: JSON.stringify(shoppingcart) }
                })
            })
        }
    }
}
</script>

<style>
.details img {
    max-width: 100%;
}
</style>

<style lang="scss" scoped>
.imgw {
    width: 100%;
}

.title {
    background-color: #fff;
    padding: .18rem;

    &>h3 {
        color: #333;
        font-size: .36rem;
    }

    &>p {
        color: #707070;
        font-size: .28rem;
    }

    &>span {
        color: #fc5051;
        font-size: .4rem;
    }
}

.container {
    background-color: #fff;
    padding: .18rem;
    margin-top: .2rem;

    &>dl:last-child {
        border-bottom: none;
    }
}

.dl {
    margin: 0;
    display: flex;
    width: 100%;
    font-size: .28rem;
    height: .88rem;
    padding-top: .27rem;
    border-bottom: 1px solid #ebebeb;

    &>dt {
        color: #333;
        flex: 0 0 1.26rem;
    }

    &>dd {
        margin: 0;
        color: #707070;
        flex: 0 0 calc(100% - 1.66rem);
    }

    &>dd:last-child {
        color: #e6e6e6;
        flex: 0 0 .4rem;
    }
}

.article-dl {
    &>dd:last-child {
        text-align: right;
        flex: 1;

        &>span {
            margin-right: .2rem;
            color: #707070;
        }
    }
}

.article {
    display: flex;
    border-bottom: 1px solid #ebebeb;

    &>dt {
        flex: 0 0 calc(100% - 1.5rem);
        font-size: .3rem;
        color: #333;

        div {
            display: flex;
            align-items: center;
        }

        img {
            margin-right: .15rem;
            width: .5rem;
            border-radius: 50%;
        }
    }

    &>dd {
        flex: 1;
        margin: 0;
        font-size: .24rem;
        color: #707070;
    }
}

.footer-placholder {
    height: .98rem;
    width: 100%;
}

.footer {
    position: fixed;
    bottom: 0;
    z-index: 3;
    display: flex;
    width: 100%;
    height: .98rem;
    background-color: #fff;
    border-top: 1px solid #ebebeb;
    font-size: .2rem;
    color: #707070;
    text-align: center;

    p {
        margin: 5px;
    }

    span {
        font-size: .48rem;
    }

    &>div {
        flex: 1;
        padding-top: .1rem;
    }

    &>div:last-child {
        padding: 0;
        flex: 0 0 2.4rem;
        background-color: #fc5051;
        color: #fff;
        font-size: .28rem;
        line-height: .98rem;
    }
}
</style>
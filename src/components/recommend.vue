<template>
    <!-- 商品列表 -->
    <div class="home-pro">
        <h3 class="title">
            <span v-show="showType === 'new'" class="iconfont icon-left-circle" @click="getHot"></span>
            {{ showType === 'hot' ? '超值热卖' : '最新上架' }} <span class="iconfont icon-round_right"
                v-show="showType === 'hot'" @click="getNew"></span>
        </h3>
        <Product :dataList="showData" />
    </div>
</template>

<script>
import { getPro } from "../api/productService"
import { staticUrl } from "../api/api"
import Product from "./product.vue"
export default {
    name: 'Recommend',
    components: {
        Product
    },
    
    data() {
        return {
            staticUrl,
            proData: { hot: [], new: [] }, //  商品数据，把对应商品的数据放到属性，如果属性有数据就不需要从后端请求数据。
            showType: "hot",

        }
    },

    computed: {
        // 计算显示那个分类的数据
        showData() {
            return this.proData[this.showType];
        }
    },

    mounted() {
        this.getHot()
    },

    methods: {
        getHot() { // 获取热卖商品数据
            if (this.proData.hot.length > 0) {
                this.showType = "hot"
            } else {
                getPro({ page: 1, orderbytype: "sales" }, (res) => {
                    this.proData.hot = res.data[0].data
                    this.showType = "hot"
                });
            }
        },

        getNew() { // 获取最新上架商品数据
            if (this.proData.new.length > 0) {
                this.showType = "new"
            } else {
                getPro({ page: 1, orderbytype: "id" }, (res) => {
                    this.proData.new = res.data[0].data
                    this.showType = "new"
                });
            }
        },


    },

}
</script>

<style src="../pages/Home/index.scss">
</style>
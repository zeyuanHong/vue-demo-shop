<template>
    <div class="container">
        <div v-for="(item, index) in dataList" :key="index">
            <router-link :to="'/detail/'+item.id">
                <!-- 取第一张图片 -->
                <img :src="staticUrl+ '/' + item.img.split(',')[0]" />
                <h3>{{ item.title }}</h3>
                <!-- 解决精度问题，保留两位小数 -->
                <p><span class="f-24">￥</span>{{ (item.price * item.discount / 10).toFixed(2) }}
                    <del>￥{{ item.price }}</del>
                </p>
            </router-link>
        </div>
    </div>
</template>

<script>
import { staticUrl } from "../api/api"
export default {
    name: 'Product',
    props:['dataList'],
    data(){
        return {
            staticUrl
        }
    }
}
</script>


<style lang="scss" scoped>
.f-24 {
    font-size: .24rem;
}

.container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    &>div {
        flex: 0 0 50%;
        padding-bottom: .25px;
        margin: .2rem 0;

        a {
            display: block;
            width: 100%;
            border: 1px solid #ebebeb;
        }

        img {
            width: 100%;
        }

        h3 {
            // 显示三行段落
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
            margin: 0;
            height: 1.08rem;
            margin-top: .33rem;
            font-size: .28rem;
            color: #333;
            padding: 0 .24rem;
        }

        p {
            margin: 0;
            margin-top: .33rem;
            font-size: .28rem;
            color: #fc5051;
            padding: 0 .24rem;
        }

        del {
            font-size: .24rem;
            color: #333;
        }
    }

    &>div:nth-child(odd) {
        // 奇数的div元素
        padding-right: .12rem;
    }

    &>div:nth-child(even) {
        // 偶数的div元素
        padding-left: .12rem;
    }
}
</style>
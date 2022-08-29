<template>
  <van-nav-bar title="订单详情" left-arrow @click-left="hideCom" fixed placeholder />
  <van-card v-for="(item,index) in proList" :num="item.num" :price="item.price" :title="item.title"
    :thumb="staticUrl + '/' + item.img" :key="index" >
    <template #tags>
      <van-tag v-if="item.color" plain type="danger">颜色:{{ item.color }}</van-tag><br />
      <van-tag v-if="item.size" plain type="danger">尺寸{{ item.size }}</van-tag>
    </template>
    <template #footer>
      <van-button @click="handShowArticle(item)" v-if="data.status >= 3 && !item.hasArticle" type="success"
        size="mini">我要评价</van-button>
    </template>
  </van-card>
  <dl class="dl">
    <dt>收货地址:</dt>
    <dd>{{ data.address }}</dd>
  </dl>
  <dl class="dl">
    <dt>订单编号:</dt>
    <dd>{{ data.orderid }}</dd>
  </dl>
  <dl class="dl">
    <dt>下单时间:</dt>
    <dd>{{ formatDateStr(data.createtime) }}</dd>
  </dl>
  <dl class="dl">
    <dt>订单状态:</dt>
    <dd>{{ ORDER_STATUS[data.status] }}</dd>
  </dl>
  <template v-if="data.status > 1">
    <dl class="dl">
      <dt>快递名称:</dt>
      <dd>{{ data.EMSname }}</dd>
    </dl>
    <dl class="dl">
      <dt>快递单号:</dt>
      <dd>{{ data.EMS }}</dd>
    </dl>
  </template>
  <dl class="dl" v-if="data.status === 2">
    <dt></dt>
    <dd>
      <van-button @click="handleConfirmOrder"  type="success" size="mini">确认收货</van-button>
    </dd>
  </dl>
  <van-submit-bar :price="data.allprice * 100" button-text="" />
  <van-popup v-model:show="show">
    <div class="article">
      <van-cell-group inset>
        <van-field v-model="message" rows="1" autosize label="评价" type="textarea" maxlength="200"
          placeholder="请输入评价内容" />
      </van-cell-group>
      <p>
        <van-rate v-model="value" :count="5" />
      </p>
      <p>
        <van-button @click="handleArticle" type="primary" size="small">提交</van-button>
      </p>
    </div>
  </van-popup>
</template>

<script>
import { staticUrl } from '../api/api'
import { formatDate } from "../util/tool"
import { ORDER_STATUS } from "../config/index"
import { confirmOrder, saveArticle, updateOrderProlist } from "../api/orderService"
export default {
  props: ["data", "hideCom", "changeOrderStatus"],
  data() {
    return {
      staticUrl,
      ORDER_STATUS,
      show: false, // 显示评价弹窗
      message: "", // 评价内容
      value: 5, // 评分
    }
  },
  
  computed: {
    proList() {// 订单的商品数据
      return this.data.prolist ? JSON.parse(this.data.prolist) : []
    }
  },
  
  methods: {
    formatDateStr(str) { // 格式化时间
      return formatDate(str, "YYYY-MM-DD hh:mm:ss")
    },
    
    handleConfirmOrder() {// 确认收货
      const { orderid } = this.data;
      confirmOrder({ orderid }, (res) => {
        this.changeOrderStatus(orderid, "status", 3) // 修改父组件对应订单数据的status
      })
    },
    
    handShowArticle() { //  显示评价弹窗
      this.show = true
      this.message = ""
      this.score = 5
    },
    
    handleArticle(item) {// 提交评价
      saveArticle({
        proid: item.id,
        text: this.message,
        score: this.value
      }, () => {
        for (let i = 0; i < this.proList.length; i++) {
          if (this.proList[i].id === item.id) {
            this.proList[i].hasArticle = true
            break
          }
        }
        const { orderid } = this.data;
        updateOrderProlist({
          prolist: JSON.stringify(this.proList),
          orderid: orderid
        }, () => {
          this.changeOrderStatus(orderid, "prolist", JSON.stringify(this.proList)) // 修改父组件对应订单数据的status
          this.changeOrderStatus(orderid, "status", 4)
        })
        this.show = false
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.article {
  text-align: center;
}

.p-15 {
  padding: 0 15px;
}

.success {
  text-align: center;
}

.dl {
  display: flex;
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;

  &>dt {
    width: 100px;
  }

  &>dd {
    margin: 0;
    flex: 1;
  }
}
</style>
<template>
  <div class="header">
    <img @click="handleAvatar" :src="getProfile.avatar ? staticUrl + '/' + getProfile.avatar : defaultImg" />
    <div>
      <h3><span @click="handleEditNick">{{ getProfile.nick }}</span> <small @click="logout">退出登录</small></h3>
      <p>
        <span>普通会员</span>
        <span>打卡签到</span>
      </p>
    </div>
    <figure>
      <img src="../../assets/images/ercode_03.png" />
    </figure>
  </div>

  <van-popup class="my-popup" v-model:show="show">
    <p>{{ show === 'img' ? '修改用户头像' : '修改用户昵称' }}</p>
    <van-uploader v-model="fileList" v-if="show === 'img'" :after-read="afterRead" :max-count="1" @delete="delImg" />
    <template v-if="show === 'nick'">
      <van-cell-group inset>
        <van-field v-model="nick" label="" placeholder="昵称" />
      </van-cell-group>
      <p>
        <van-button @click="confirmNick" type="primary">确定修改</van-button>
      </p>
    </template>
  </van-popup>

  <!-- 第一行图标 -->
  <ul class="container">
    <li>
      <span class="iconfont icon-31daifukuan"></span>
      <p>待付款</p>
    </li>
    <li>
      <span class="iconfont icon-31daifahuo"></span>
      <p>待发货</p>
    </li>
    <li>
      <span class="iconfont icon-31daishouhuo"></span>
      <p>待收货</p>
    </li>
    <li>
      <span class="iconfont icon-daipingjia"></span>
      <p>待评价</p>
      <img class="img" src="../../assets/images/my_icon_bg_03.png" />
    </li>
    <li @click="$router.push('/order')">
      <span class="iconfont icon-wodedingdan"></span>
      <p>我的订单</p>
    </li>
  </ul>

  <!-- 第二行图标 -->
  <ul class="container mt-2">
    <li>
      <em>{{ getProfile.mymoney.toFixed(2) }}</em>
      <p>余额</p>
    </li>
    <li>
      <em>0</em>
      <p>优惠卷</p>
    </li>
    <li>
      <em>0</em>
      <p>积分</p>
    </li>
    <li>
      <em>0</em>
      <p>可提现</p>
      <img class="img" src="../../assets/images/my_icon_bg_03.png" />
    </li>
    <li @click="$router.push('/paypal')">
      <span class="iconfont icon-31daifukuan color-pink"></span>
      <p>我的钱包</p>
    </li>
  </ul>

  <!-- 第三部分8个图标 -->
  <ul class="subNav mt-2">
    <li>
      <img src="../../assets/images/a_03.png" />
      <p>足迹</p>
    </li>
    <li>
      <img src="../../assets/images/a_11.png" />
      <p>会员</p>
    </li>
    <li>
      <img src="../../assets/images/a_06.png" />
      <p>收藏</p>
    </li>
    <li>
      <img src="../../assets/images/a_08.png" />
      <p>分销</p>
    </li>
    <li>
      <img src="../../assets/images/a_21.png" />
      <p>消息</p>
    </li>
    <li>
      <img src="../../assets/images/a_18.png" />
      <p>设置</p>
    </li>
    <li>
      <img src="../../assets/images/a_26.png" />
      <p>客服</p>
    </li>
    <li>
      <img src="../../assets/images/a_24.png" />
      <p>帮助</p>
    </li>
  </ul>

  <Recommend />
</template>

<script>
import { Notify } from "vant"
import { staticUrl } from "../../api/api"
import { mapGetters, mapActions } from "vuex"
import defaultImg from "../../assets/images/头像.jpg"
import Recommend from "../../components/recommend.vue"
import { profile, updateavatar, updateProfile } from "../../api/userServer"
import { addDetailImg, delDetailImg } from "../../api/otherServer"
export default {
  name: 'My',
  components: {
    Recommend
  },

  data() {
    return {
      staticUrl,
      defaultImg,
      show: false, // 弹窗的显示隐藏
      fileList: [], // 上传文件预览
      nick: "", // 修改的昵称
    }
  },

  computed: {
    ...mapGetters('user', ['getProfile'])
  },

  mounted() {
    this.init()
  },


  methods: {
    ...mapActions('user', ['setProfileAction']),

    init() {
      if (!this.getProfile.id) {
        profile((res) => {
          this.setProfileAction({ data: res.data[0][0] })
        })
      }
    },

    handleAvatar() { // 点击修改头像
      this.show = 'img'
      // 点击修改头像需要把当前用户头像默认显示上传组件里面
      this.fileList = [{ url: staticUrl + '/' + this.getProfile.avatar, isImage: true, name: this.getProfile.avatar }]
    },

    afterRead(file) { //  文件上传触发的函数
      console.log(file);
      let form = new FormData(); // 创建表单对象
      form.append("file", file.file)
      addDetailImg(form, (res) => {
        // 图片上传完成以后更新用户头像
        const { url } = res.data;
        updateavatar({ avatar: url }, (res) => {
          this.fileList = [{ url: staticUrl + '/' + url, isImage: true, name: url }]
          // 头像更新到后端以后，还需要把全局store里面的头像更新
          this.setProfileAction({ data: { ...this.getProfile, avatar: url } })
        })
      })
    },

    delImg(file) { // 删除图片
      delDetailImg({ file: [file.name] }, () => {
        Notify({ type: "success", message: "删除成功" });
        // 删除用户头像,也需要同步到后端用户信息
        updateavatar({ avatar: "" }, (res) => {
          // 需要把全局store里面的头像更新
          this.setProfileAction({ data: { ...this.getProfile, avatar: "" } })
        })
      })
    },

    handleEditNick() { // 点击昵称触发的事件
      this.show = "nick";
      this.nick = this.getProfile.nick;
    },

    confirmNick() { // 确认修改昵称
      if (this.getProfile.nick === this.nick) return;// 如果用户昵称没有修改，则不需要发送请求到后端。
      updateProfile({
        filedname: "nick",
        filedvalue: this.nick
      }, (res) => {
        this.setProfileAction({ data: { ...this.getProfile, nick: this.nick } });
        this.show = false;
      })
    },

    // 退出登录
    logout(){
      this.$router.push('/login')
      this.setProfileAction({data:{}})// 全局状态的用户信息也要清理
      localStorage.clear() // 清理localstorage的缓存数据
    }


  }
}
</script>

<style lang="scss">
.my-popup {
  width: 80%;
  text-align: center;
  padding: 15px;

  .van-cell-group {
    border: 1px solid #ccc;
  }
}
</style>

<style lang="scss" scoped>
.header {
  height: 1.95rem;
  background-image: url(../../assets/images/user-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #fff;

  &>img {
    float: left;
    margin-left: .24rem;
    margin-top: .3rem;
    width: 1.27rem;
    height: 1.27rem;
    border: 2px solid #fff;
    border-radius: 50%;
  }

  &>div {
    float: left;
    margin-left: .2rem;

    &>h3 {
      font-size: .32rem;
      color: #fff;

      small {
        font-size: .24rem;
        color: rgba($color: #fff, $alpha: 0.8);
      }
    }

    &>p {
      span {
        display: inline-block;
        border: 1px solid rgba($color: #fff, $alpha: 0.8);
        color: rgba($color: #fff, $alpha: 0.8);
        padding: 5px;
        margin-left: 5px;
      }
    }
  }

  &>figure {
    float: right;
    margin: 0;
    margin-top: .5rem;
    margin-right: .23rem;
    width: .92rem;
    height: .92rem;
    background-color: rgba($color: #fff, $alpha: 0.3);
    padding: .15rem;
    border-radius: 50%;
    text-align: center;

    img {
      width: 100%;
    }
  }
}

.container {
  display: flex;
  width: 100%;
  background-color: #fff;
  margin: 0;
  text-align: center;
  font-size: .24rem;
  color: #707070;
  padding: .3rem 0;

  &>li {
    position: relative;
    flex: 0 0 20%;

    em {
      font-style: normal;
      font-size: .32rem;
      color: #fe6c71;
    }

    .img {
      position: absolute;
      top: 0;
      right: -5px;
      height: 80%;
    }

    span {
      color: #e5be70;
      font-size: .45rem;
    }

    p {
      margin: .22rem;
    }
  }
}

.mt-2 {
  margin-top: .2rem;
}

.color-pink{
  color: #fe6c71 !important;
}

.subNav {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  background-color: #fff;
  text-align: center;
  font-size: .24rem;
  color: #333;

  &>li {
    flex: 0 0 25%;
    margin: .35rem auto;

    &>img {
      width: .8rem;
    }
  }
}
</style>
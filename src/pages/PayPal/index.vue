<template>
    <van-nav-bar title="我的钱包" left-arrow @click-left="$router.go(-1)" fixed placeholder />
    <div class="card">
        <p>账号余额</p>
        <h3>￥<span>{{ money }}</span></h3>
    </div>
    <div class="btns">
        <van-button @click="handlePay" color="#fd5151" type="primary" block>充值</van-button>
        <van-button class="mt-2" type="default" block>提现</van-button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { updateProfile } from "../../api/userServer"
export default {
    computed: {
        ...mapGetters("user", ["getProfile"]),
        money() {
            if (this.getProfile.mymoney) {
                return Number(this.getProfile.mymoney).toFixed(2)
            }
            return 0.00;
        }
    },
    methods: {
        ...mapActions("user", ["setProfileAction"]),
        handlePay() {
            updateProfile({ // 充值用户余额
                filedname: "mymoney",
                filedvalue: 100
            }, () => {
                this.setProfileAction({ data: { ...this.getProfile, mymoney: this.getProfile.mymoney + 100 } })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.mt-2 {
    margin-top: .2rem;
}

.card {
    display: flex;
    flex-direction: column;
    width: 6.90rem;
    height: 3.32rem;
    justify-content: center;
    align-items: center;
    font-size: .28rem;
    margin: .3rem auto;
    border-radius: 5px;
    color: #fff;
    background-image: linear-gradient(to top right, #ff5542, #fc943a);
    box-shadow: 2px 2px 7px 5px rgba(0, 0, 0, 0.1);

    p {
        margin: 0;
    }

    &>h3 {
        margin-top: .5rem;
        font-weight: 400;

        span {
            font-size: .94rem;
        }
    }
}

.btns {
    width: 6.90rem;
    margin: 1.52rem auto;
}
</style>
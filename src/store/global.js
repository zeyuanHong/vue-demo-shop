export default {
    namespaced: true,
    state: {
        bannerData: [], // banner数据
        typeData: sessionStorage.getItem("typeData") ? JSON.parse(sessionStorage.getItem("typeData")) : [] // 分类数据
    },

    getters: {
        getBanner(state) {
            return state.bannerData;
        },
        getTypeData(state) {
            return state.typeData;
        },
        getTypeDataTitle(state) { // 返回一级分类
            // console.log(state.typeData);
            return state.typeData.filter((item) => item.typelevel === 0);
        },
        recommendType(state) { // 返回推荐分类
            let data = state.typeData.filter((item) => item.fatherid.includes(1) && item.typelevel === 1)
            console.log(data)
            return data.length > 4 ? data.splice(0, 4) : data;
        },
    },

    mutations: {
        setBanner(state, paylod) { // 修改banner数据
            // console.log(paylod.data)
            state.bannerData = paylod.data
        },
        setType(state, paylod) { // 修改分类数据
            // 由于刷新页面，state的数据被被清空。需要用sessionStorage持久缓存数据
            console.log(paylod.data)
            sessionStorage.setItem("typeData", JSON.stringify(paylod.data));
            state.typeData = paylod.data
        }
    },

    actions: {
        setBannerAction(context, paylod) {
            // console.log(paylod)
            context.commit({
                ...paylod,
                type: "setBanner"
            })
        },
        setTypeAction(context, paylod) {
            context.commit({
                ...paylod,
                type: "setType"
            })
        }
    },


}
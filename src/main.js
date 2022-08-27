import { createApp } from 'vue'
import {
    Button, Icon, Tabbar, TabbarItem, Search, Swipe, SwipeItem, NavBar, Sidebar,
    SidebarItem, List, PullRefresh, Picker, Popup, Form, Field, CellGroup, Uploader,
    Badge, SubmitBar, Checkbox, Card, CheckboxGroup,
    AddressList, AddressEdit, Tag, Rate
} from 'vant'

import App from './App.vue'
import router from './router'
import store from './store'

import 'vant/lib/index.css' // 引入vant样式
import "./style/font_icon/iconfont.css" // 引入字体图标文件
import "./style/index.scss"// 引入全局样式文件

createApp(App)
    .use(router)
    .use(store)
    .use(Icon)
    .use(Button)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(Swipe)
    .use(SwipeItem)
    .use(NavBar)
    .use(Sidebar)
    .use(SidebarItem)
    .use(List)
    .use(PullRefresh)
    .use(Picker)
    .use(Popup)
    .use(Form)
    .use(Field)
    .use(CellGroup)
    .use(Uploader)
    .use(Badge)
    .use(SubmitBar)
    .use(Checkbox)
    .use(Card)
    .use(CheckboxGroup)
    .use(AddressList)
    .use(AddressEdit)
    .use(Tag)
    .use(Rate)
    .mount('#app')

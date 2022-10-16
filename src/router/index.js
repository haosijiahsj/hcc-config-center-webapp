// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 首页
import index from '../pages/index';
import AppManage from '../pages/configCenter/appManage';
import ConfigManage from '../pages/configCenter/configManage';


// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
    routes: [
        {
            path: '/index',
            name: '主页',
            component: index,
            children: [
                {
                    path: '/configCenter/appManage',
                    name: '应用管理',
                    component: AppManage
                },
                {
                    path: '/configCenter/configManage',
                    name: '配置管理',
                    component: ConfigManage
                }
            ]
        }
    ]
});
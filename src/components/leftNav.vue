<template>
  <div>
    <el-menu router :default-active="$route.path">
      <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{menu.name}}</span>
        </template>
        <el-menu-item :index="'/' + child.path" v-for="child in menu.children" :key="child.id">
          <i :class="child.icon"></i>
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [
        // {
        //   id: 1,
        //   name: 'Dashboard',
        //   icon: 'el-icon-document',
        //     children: [
        //         {
        //             id: 11,
        //             name: '统计',
        //             path: ''
        //         }
        //     ]
        // },
        {
          id: 2,
          name: '配置中心',
          icon: 'el-icon-menu',
          children: [
            {
              id: 21,
              name: '应用管理',
              path: 'configCenter/appManage'
            },
            {
              id: 22,
              name: '配置管理',
              path: 'configCenter/configManage'
            }
          ]
        }
      ]
    }
  }    
}
</script>
<style scoped>
</style>
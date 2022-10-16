<template>
  <div style="text-align: right">
    <el-menu mode="horizontal">
      <el-menu-item index="1">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>主页</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [
        {
          id: 1,
          name: 'Dashboard'
        },
        {
          id: 2,
          name: '配置中心',
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
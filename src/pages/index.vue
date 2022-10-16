<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div><top-nav /></div>
      </el-header>
      <el-container>
        <!-- 左侧导航 -->
        <el-aside width="250px;">
          <div class="left-nav-box"><left-nav /></div>
        </el-aside>
        <!-- body -->
        <el-main >
          <div>
            <router-view/>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import leftNav from "~/components/leftNav";
import topNav from "~/components/topNav";
export default {
  components: {
    "left-nav": leftNav,
    "top-nav": topNav
  }
};
</script>
<style>
.left-nav-box{
  width: 220px;
  text-align: left;
}
</style>
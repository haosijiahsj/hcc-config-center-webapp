<template>
  <div style="text-align: left">
    <el-card shadow="hover" size="mini">
      <div slot="header">
        <span>查询条件</span>
      </div>
      <div>
        <el-form :inline="true" size="mini">
          <el-form-item label="应用名称">
            <el-input placeholder="应用名称"></el-input>
          </el-form-item>
          <el-form-item label="配置key">
            <el-input placeholder="配置key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="hover">
      <div slot="header">
        <span>应用信息</span>
      </div>
      <el-descriptions title="" size="mini">
        <el-descriptions-item label="应用编码">-</el-descriptions-item>
        <el-descriptions-item label="应用名称">-</el-descriptions-item>
        <el-descriptions-item label="密钥">-</el-descriptions-item>
        <el-descriptions-item label="负责人">-</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card shadow="hover">
      <div slot="header">
        <span>配置信息</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="静态配置" name="staticConfig">
          <div style="text-align: right;">
            <el-button size="mini">新增</el-button>
            <el-button size="mini">导入</el-button>
            <el-button size="mini">导出</el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="[]"
            size="mini"
            :header-cell-style="headerCellStyle"
            border="true"
          >
            <el-table-column prop="key" label="配置key"> </el-table-column>
            <el-table-column prop="value" label="值"> </el-table-column>
            <el-table-column prop="comment" label="注释"> </el-table-column>
            <el-table-column prop="operate" width="150" label="操作">
            </el-table-column>
          </el-table>
          <div class="page-class">
            <el-pagination
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              current-page="1"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              total="0"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动态配置" name="dynamicConfig">
          <div style="text-align: right">
            <el-button size="mini">新增</el-button>
            <el-button size="mini">导入</el-button>
            <el-button size="mini">导出</el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="[]"
            size="mini"
            :header-cell-style="headerCellStyle"
            border="true"
          >
            <el-table-column prop="key" label="配置key"> </el-table-column>
            <el-table-column prop="value" label="值"> </el-table-column>
            <el-table-column prop="comment" label="注释"> </el-table-column>
            <el-table-column prop="version" label="版本"> </el-table-column>
            <el-table-column prop="operate" label="操作"> </el-table-column>
          </el-table>
          <div class="page-class">
            <el-pagination
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              current-page="1"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              total="0"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "staticConfig",
    };
  },
};
</script>
<style scoped>
.el-card {
  margin-bottom: 10px;
  min-height: 100%;
  height: 100%;
}
.el-card /deep/ .el-card__header {
  text-align: left;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 14px;
}
.page-class {
    margin-bottom: 5px;
    text-align: right;
}
</style>
<template>
  <div style="text-align: left">
    <el-card shadow="hover" size="mini">
      <div slot="header">
        <span>查询条件</span>
      </div>
      <div>
        <el-form :model="queryForm" :inline="true" size="mini">
          <el-form-item label="应用名称">
            <el-select v-model="queryForm.applicationId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in allAppInfos"
                :key="item.id"
                :label="item.appName + '[' + item.appCode + ']'"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置key">
            <el-input v-model="queryForm.key" placeholder="配置key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="hover">
      <div slot="header">
        <span>应用信息</span>
      </div>
      <el-descriptions title="" size="mini">
        <el-descriptions-item label="应用编码">{{appInfo.appCode ? appInfo.appCode : '-'}}</el-descriptions-item>
        <el-descriptions-item label="应用名称">{{appInfo.appName ? appInfo.appName : '-'}}</el-descriptions-item>
        <el-descriptions-item label="密钥">{{appInfo.secretKey ? appInfo.secretKey : '-'}}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{appInfo.owner ? appInfo.owner : '-'}}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card shadow="hover">
      <div slot="header">
        <span>配置信息</span>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="静态配置" name="staticConfig">
          <div style="text-align: right;">
            <el-button size="mini">新增</el-button>
            <el-button size="mini">导入</el-button>
            <el-button size="mini">导出</el-button>
          </div>
          <el-table
            v-loading="staticLoading"
            :data="staticQueryResult.data"
            size="mini"
            :border="true"
          >
            <el-table-column prop="key" label="配置key"> </el-table-column>
            <el-table-column prop="value" label="值"> </el-table-column>
            <el-table-column prop="comment" label="注释"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间"> </el-table-column>
            <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
            <el-table-column prop="operate" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editConfig(scope.row)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  :underline="false"
                  type="text"
                  size="mini"
                  @click="deleteConfig(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="page-class">
            <el-pagination
              small
              background
              @size-change="staticSizeChange"
              @current-change="staticCurrentChange"
              :current-page="staticQueryResult.page"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total="staticQueryResult.totalSize"
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
            v-loading="dynamicLoading"
            :data="dynamicQueryResult.data"
            size="mini"
            :border="true"
          >
            <el-table-column prop="key" label="配置key"> </el-table-column>
            <el-table-column prop="value" label="值"> </el-table-column>
            <el-table-column prop="comment" label="注释"> </el-table-column>
            <el-table-column prop="version" label="版本"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间"> </el-table-column>
            <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
            <el-table-column prop="operate" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editConfig(scope.row)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="pushConfig(scope.row)"
                  size="mini"
                  >推送</el-button
                >
                <el-button
                  :underline="false"
                  type="text"
                  size="mini"
                  @click="deleteConfig(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="page-class">
            <el-pagination
              small
              background
              @size-change="dynamicSizeChange"
              @current-change="dynamicCurrentChange"
              :current-page="dynamicQueryResult.page"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total="dynamicQueryResult.totalSize"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ajax from "~/api/ajax";
export default {
  data() {
    return {
      activeName: "staticConfig",
      allAppInfos: [],
      appInfo: {
        appCode: null,
        appName: null,
        secretKey: null,
        owner: null
      },
      queryForm: {
        applicationId: null,
        key: null,
        page: 1,
        size: 10
      },
      staticQueryPage: {
        page: 1,
        size: 10
      },
      dynamicQueryPage: {
        page: 1,
        size: 10
      },
      staticQueryResult: {

      },
      dynamicQueryResult: {

      },
    };
  },
  mounted() {
    let that = this;
      // 查询所有app信息
      ajax.get("/application/all").then((rs) => {
        if (rs.success) {
          that.allAppInfos = rs.data;
        } else {
          this.$message.error("查询失败！请稍后再试！");
        }
      });
  },
  methods: {
    queryAppConfig(dynamic) {
      let that = this;
      that.queryForm.dynamic = dynamic;
      if (dynamic) {
        that.queryForm.page = that.dynamicQueryPage.page;
        that.queryForm.size = that.dynamicQueryPage.size;
      } else {
        that.queryForm.page = that.staticQueryPage.page;
        that.queryForm.size = that.staticQueryPage.size;
      }
      ajax.post("/application-config/page", that.queryForm).then((rs) => {
        if (rs.success) {
          if (dynamic) {
            that.dynamicQueryResult = rs.data;
          } else {
            that.staticQueryResult = rs.data;
          }          
        } else {
          this.$message.error("查询失败！请稍后再试！");
        }
      });
    },
    staticSizeChange(size) {
      this.staticQueryPage.size = size;
      this.queryAppConfig(false);
    },
    staticCurrentChange(current) {
      this.staticQueryPage.page = current;
      this.queryAppConfig(false);
    },
    dynamicSizeChange(size) {
      this.dynamicQueryPage.size = size;
      this.queryAppConfig(true);
    },
    dynamicCurrentChange(current) {
      this.dynamicQueryPage.page = current;
      this.queryAppConfig(true);
    },
    query() {
      let that = this;
      // 查询app信息
      ajax.get("/application/get/" + that.queryForm.applicationId).then((rs) => {
        if (rs.success) {
          that.appInfo = rs.data;
        } else {
          this.$message.error("查询失败！请稍后再试！");
        }
      });
      if (that.activeName == "staticConfig") {
        that.queryAppConfig(false);
      } else {
        that.queryAppConfig(true);
      }      
    },
    eidtConfig(row) {},
    deleteConfig(row) {},
    pushConfig(row) {},
  }
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
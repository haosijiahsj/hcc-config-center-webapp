<template>
  <div style="text-align: left">
    <el-card shadow="never">
      <div slot="header">
        <span>查询条件</span>
      </div>
      <div>
        <el-form :model="queryForm" :inline="true" size="small">
          <el-form-item label="应用名称">
            <el-select
              v-model="queryForm.applicationId"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in allAppInfos"
                :key="item.id"
                :label="item.appName + '[' + item.appCode + ']'"
                :value="item.id"
              >
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
    <el-card shadow="never">
      <div slot="header">
        <span>应用信息</span>
      </div>
      <el-descriptions title="" size="small" :column="3">
        <el-descriptions-item label="应用编码">
          {{ appInfo.appCode ? appInfo.appCode : "-" }}&nbsp;&nbsp;
          <el-link
            v-if="appInfo.appCode"
            :underline="false"
            type="primary"
            @click="copy(appInfo.appCode)"
          >
            <span style="font-size: 12px">复制</span>
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="密钥">
          {{ appInfo.secretKey ? appInfo.secretKey : "-" }}&nbsp;&nbsp;
          <el-link
            v-if="appInfo.secretKey"
            :underline="false"
            type="primary"
            @click="copy(appInfo.secretKey)"
          >
            <span style="font-size: 12px">复制</span>
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <span v-if="!appInfo.appStatus">-</span>
          <el-tag
            v-else-if="appInfo.appStatus == 'ONLINE'"
            type="success"
            size="mini"
            >{{ appInfo.appStatusDesc }}</el-tag
          >
          <el-tag
            v-else-if="appInfo.appStatus == 'OFFLINE'"
            type="danger"
            size="mini"
            >{{ appInfo.appStatusDesc }}</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item label="应用名称">{{
          appInfo.appName ? appInfo.appName : "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="模式">
          <span v-if="!appInfo.appMode">-</span>
          <el-tag
            v-else-if="appInfo.appMode == 'LONG_CONNECT'"
            type="success"
            size="mini"
            >{{ appInfo.appModeDesc }}</el-tag
          >
          <el-tag v-else-if="appInfo.appMode == 'LONG_POLLING'" size="mini">{{
            appInfo.appModeDesc
          }}</el-tag>
        </el-descriptions-item>
        <!-- <el-descriptions-item label="负责人">{{appInfo.owner ? appInfo.owner : '-'}}</el-descriptions-item> -->
      </el-descriptions>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>配置信息</span>
        <span style="float: right">
          <el-button
            type="text"
            size="small"
            icon="el-icon-upload"
            @click="importConfig"
            >导入</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-download"
            @click="exportConfig"
            >导出</el-button
          >
        </span>
      </div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="静态配置" name="staticConfig">
          <div style="text-align: right">
            <el-button size="mini" @click="saveConfig" icon="el-icon-plus"
              >新增</el-button
            >
          </div>
          <el-table
            v-loading="staticLoading"
            :data="staticQueryResult.data"
            size="mini"
            :border="true"
          >
            <el-table-column prop="key" label="配置key" width="200">
            </el-table-column>
            <el-table-column prop="value" label="配置值"> </el-table-column>
            <el-table-column prop="comment" label="注释"> </el-table-column>
            <el-table-column prop="version" label="版本" width="50">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间">
            </el-table-column>
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
                <el-button
                  :underline="false"
                  type="text"
                  size="mini"
                  @click="queryHistory(scope.row)"
                  >历史记录</el-button
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
            <el-button size="mini" @click="saveConfig" icon="el-icon-plus"
              >新增</el-button
            >
          </div>
          <el-table
            v-loading="dynamicLoading"
            :data="dynamicQueryResult.data"
            size="mini"
            :border="true"
          >
            <el-table-column prop="key" label="配置key"> </el-table-column>
            <el-table-column prop="value" label="配置值"> </el-table-column>
            <el-table-column prop="comment" label="注释"> </el-table-column>
            <el-table-column prop="version" label="版本" width="50">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editConfig(scope.row)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  v-if="
                    appInfo.appStatus == 'ONLINE' &&
                    appInfo.appMode == 'LONG_CONNECT'
                  "
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
                &nbsp;&nbsp;
                <el-popover placement="top" trigger="hover" popper-class="button-popover">
                  <el-button
                    :underline="false"
                    type="text"
                    size="mini"
                    @click="queryHistory(scope.row)"
                    >历史记录</el-button
                  >
                  <el-button
                    :underline="false"
                    type="text"
                    size="mini"
                    @click="queryPushRecord(scope.row)"
                    >推送记录</el-button
                  >
                  <el-button
                    slot="reference"
                    icon="el-icon-more"
                    type="text"
                    size="mini"
                  ></el-button>
                </el-popover>
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
    <div>
      <el-dialog
        :title="saveFormTitle"
        :visible.sync="saveDialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form :model="saveForm" ref="saveForm" size="mini" :rules="saveFormRules">
          <el-form-item label="key" label-width="60px" prop="key">
            <el-input
              v-model="saveForm.key"
              autocomplete="off"
              :disabled="saveForm.id != null"
            ></el-input>
          </el-form-item>
          <el-form-item label="value" label-width="60px" prop="value">
            <el-input
              v-model="saveForm.value"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="注释" label-width="60px">
            <el-input
              v-model="saveForm.comment"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-alert v-if="saveForm.id != null" title="注意：版本号只会在value值变更时+1" type="warning"></el-alert>
        <div slot="footer">
          <el-button @click="saveDialogVisible = false" size="mini"
            >取消</el-button
          >
          <el-button type="primary" @click="saveOrUpdateConfig" size="mini"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :title="historyTitle"
        :visible.sync="historyDialogVisible"
        width="55%"
        :close-on-click-modal="false"
      >
        <el-table :data="historyQueryResult.data" size="mini" :border="true">
          <el-table-column prop="value" label="值"> </el-table-column>
          <el-table-column prop="version" label="版本" width="50">
          </el-table-column>
          <el-table-column prop="operateType" label="操作类型" width="100">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.operateType == 'CREATE'"
                type="success"
                size="mini"
                >{{ scope.row.operateType }}</el-tag
              >
              <el-tag
                v-if="scope.row.operateType == 'UPDATE'"
                type="warning"
                size="mini"
                >{{ scope.row.operateType }}</el-tag
              >
              <el-tag
                v-if="scope.row.operateType == 'DELETE'"
                type="danger"
                size="mini"
                >{{ scope.row.operateType }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="operateUser" label="操作人" width="100">
          </el-table-column>
          <el-table-column prop="createTime" label="操作时间">
          </el-table-column>
        </el-table>
        <div class="page-class">
          <el-pagination
            small
            background
            @size-change="historySizeChange"
            @current-change="historyCurrentChange"
            :current-page="historyQueryResult.page"
            :page-sizes="[10, 20]"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="historyQueryResult.totalSize"
          >
          </el-pagination>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :title="pushRecordTitle"
        :visible.sync="pushRecordDialogVisible"
        width="55%"
        :close-on-click-modal="false"
      >
        <el-table :data="pushRecordQueryResult.data" size="mini" :border="true">
          <el-table-column prop="value" label="值"> </el-table-column>
          <el-table-column prop="version" label="版本" width="50">
          </el-table-column>
          <el-table-column prop="operateUser" label="操作人" width="100">
          </el-table-column>
          <el-table-column prop="createTime" label="操作时间">
          </el-table-column>
        </el-table>
        <div class="page-class">
          <el-pagination
            small
            background
            @size-change="pushRecordSizeChange"
            @current-change="pushRecordCurrentChange"
            :current-page="pushRecordQueryResult.page"
            :page-sizes="[10, 20]"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="pushRecordQueryResult.totalSize"
          >
          </el-pagination>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="导入配置"
        :visible.sync="uploadDialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <el-upload
          ref="upload"
          :data="{ applicationId: appInfo.id }"
          :limit="1"
          accept=".json, .yml, .properties"
          :before-upload="beforeUpload"
          :action="uploadUrl"
          :on-success="importSuccess"
          drag
          style="text-align: center"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击导入</em></div>
          <div class="el-upload__tip" slot="tip">
            支持yml、properties、json格式，yml、properties将处理为静态配置
          </div>
        </el-upload>
        <div slot="footer">
          <el-button @click="uploadDialogVisible = false" size="mini"
            >取消</el-button
          >
          <el-button type="primary" @click="doImportConfig" size="mini"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ajax from "~/api/ajax";
export default {
  data() {
    return {
      staticLoading: false,
      dynamicLoading: false,
      activeName: "staticConfig",
      saveDialogVisible: false,
      saveFormTitle: "新增静态配置",
      allAppInfos: [],
      appInfo: {
        id: null,
        appCode: null,
        appName: null,
        appStatus: null,
        appStatusDesc: null,
        secretKey: null,
        owner: null,
      },
      saveForm: {
        applicationId: null,
        key: null,
        value: null,
        comment: null,
        dynamic: false,
      },
      saveFormRules: {
        key: [{ required: true, message: "配置key必填" }],
        value: [{ required: true, message: "配置值必填" }],
      },
      queryForm: {
        applicationId: null,
        key: null,
        page: 1,
        size: 10,
      },
      staticQueryPage: {
        page: 1,
        size: 10,
      },
      dynamicQueryPage: {
        page: 1,
        size: 10,
      },
      staticQueryResult: {},
      dynamicQueryResult: {},
      historyTitle: "历史记录",
      historyDialogVisible: false,
      historyQueryResult: {},
      historyQueryPage: {
        page: 1,
        size: 20,
      },
      pushRecordTitle: "推送记录",
      pushRecordDialogVisible: false,
      pushRecordQueryResult: {},
      pushRecordQueryPage: {
        page: 1,
        size: 20,
      },
      uploadDialogVisible: false,
      uploadUrl: ajax.getBaseUrl() + "/application-config/import",
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
    queryAppConfig() {
      let that = this;
      if (that.activeName == "staticConfig") {
        that.queryForm.dynamic = false;
        that.queryForm.page = that.staticQueryPage.page;
        that.queryForm.size = that.staticQueryPage.size;
      } else {
        that.queryForm.dynamic = true;
        that.queryForm.page = that.dynamicQueryPage.page;
        that.queryForm.size = that.dynamicQueryPage.size;
      }
      ajax.post("/application-config/page", that.queryForm).then((rs) => {
        if (rs.success) {
          if (that.queryForm.dynamic) {
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
      this.queryAppConfig();
    },
    staticCurrentChange(current) {
      this.staticQueryPage.page = current;
      this.queryAppConfig();
    },
    dynamicSizeChange(size) {
      this.dynamicQueryPage.size = size;
      this.queryAppConfig();
    },
    dynamicCurrentChange(current) {
      this.dynamicQueryPage.page = current;
      this.queryAppConfig();
    },
    tabClick() {
      if (this.queryForm.applicationId && this.appInfo.appCode) {
        this.queryAppConfig();
      }
    },
    query() {
      let that = this;
      if (!this.queryForm.applicationId) {
        this.$message.error("请先选择应用！");
        return;
      }
      // 查询app信息
      let queryAppSuccess = true;
      ajax
        .get("/application/get/" + that.queryForm.applicationId)
        .then((rs) => {
          if (rs.success) {
            that.appInfo = rs.data;
          } else {
            this.$message.error("查询应用失败！错误信息：" + rs.message);
            queryAppSuccess = false;
          }
        });
      if (!queryAppSuccess) {
        return;
      }
      if (that.activeName == "staticConfig") {
        that.queryAppConfig();
      } else {
        that.queryAppConfig();
      }
    },
    saveConfig() {
      if (!this.appInfo.id) {
        this.$message.error("请先查询应用！");
        return;
      }
      this.saveForm = {
        id: null,
        key: null,
        value: null,
        comment: null
      };
      if (this.activeName == "staticConfig") {
        this.saveFormTitle = "新增静态配置";
      } else {
        this.saveFormTitle = "新增动态配置";
      }
      this.saveDialogVisible = true;
    },
    saveOrUpdateConfig() {
      let that = this;
      that.saveForm.applicationId = that.appInfo.id;
      if (that.activeName == "staticConfig") {
        that.saveForm.dynamic = false;
      } else {
        that.saveForm.dynamic = true;
      }
      this.$refs['saveForm'].validate((valid) => {
        if (valid) {
          ajax.post("/application-config/save", that.saveForm).then((rs) => {
            if (rs.success) {
              this.$message.success("保存成功");
              that.saveDialogVisible = false;
              that.queryAppConfig();
            } else {
              this.$message.error("保存失败！错误信息：" + rs.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    editConfig(row) {
      this.saveForm = row;
      if (this.activeName == "staticConfig") {
        this.saveFormTitle = "编辑静态配置";
      } else {
        this.saveFormTitle = "编辑动态配置";
      }
      this.saveDialogVisible = true;
    },
    deleteConfig(row) {
      let that = this;
      let msg = "确定要删除配置 <strong>[" + row.key + "]</strong> 吗?";
      this.$confirm(msg, "警告", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        ajax.get("/application-config/delete/" + row.id).then((rs) => {
          if (rs.success) {
            this.$message.success("删除成功");
            that.queryAppConfig();
          } else {
            this.$message.error("删除失败！错误信息：" + rs.message);
          }
        });
      });
    },
    pushConfig(row) {
      let msg =
        "确定要推送配置 <strong>[" +
        row.key +
        ": " +
        row.value +
        "]</strong> 吗?";
      this.$confirm(msg, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        ajax.get("/application-config/push/" + row.id).then((rs) => {
          if (rs.success) {
            this.$message.success("推送成功");
          } else {
            this.$message.error("推送失败！错误信息：" + rs.message);
          }
        });
      });
    },
    copy(value) {
      var that = this;
      this.$copyText(value).then(
        function (e) {
          that.$message({
            message: "已复制",
            type: "success",
          });
        },
        function (e) {
          that.$message.error("复制失败");
        }
      );
    },
    historyCurrentChange(page) {
      this.historyQueryPage.page = page;
      this.doQueryHistory();
    },
    historySizeChange(size) {
      this.historyQueryPage.size = size;
      this.doQueryHistory();
    },
    queryHistory(row) {
      this.historyTitle = "配置：[" + row.key + "]历史记录";
      this.historyDialogVisible = true;
      this.historyQueryPage.applicationConfigId = row.id;
      this.historyQueryPage.page = 1;
      this.historyQueryPage.size = 10;
      this.doQueryHistory();
    },
    doQueryHistory() {
      var that = this;
      ajax
        .post("/application-config-history/page", that.historyQueryPage)
        .then((rs) => {
          if (rs.success) {
            that.historyQueryResult = rs.data;
          } else {
            this.$message.error("查询失败！请稍后再试！");
          }
        });
    },

    pushRecordCurrentChange(page) {
      this.pushRecordQueryPage.page = page;
      this.doQueryPushRecord();
    },
    pushRecordSizeChange(size) {
      this.pushRecordQueryPage.size = size;
      this.doQueryPushRecord();
    },
    queryPushRecord(row) {
      this.pushRecordTitle = "配置：[" + row.key + "]推送记录";
      this.pushRecordDialogVisible = true;
      this.pushRecordQueryPage.applicationConfigId = row.id;
      this.pushRecordQueryPage.page = 1;
      this.pushRecordQueryPage.size = 10;
      this.doQueryPushRecord();
    },
    doQueryPushRecord() {
      var that = this;
      ajax
        .post("/application-config-push-record/page", that.pushRecordQueryPage)
        .then((rs) => {
          if (rs.success) {
            that.pushRecordQueryResult = rs.data;
          } else {
            this.$message.error("查询失败！请稍后再试！");
          }
        });
    },
    importConfig() {
      if (!this.appInfo.id) {
        this.$message.error("请先查询应用！");
        return;
      }
      this.uploadDialogVisible = true;
    },
    exportConfig() {
      if (!this.appInfo.id) {
        this.$message.error("请先查询应用！");
        return;
      }
      window.location.href =
        ajax.getBaseUrl() +
        "/application-config/export?applicationId=" +
        this.appInfo.id;
    },
    beforeUpload(file) {},
    doImportConfig() {
      this.$refs.upload.submit();
    },
    importSuccess(rs) {
      if (rs.success) {
        this.$message.success("导入成功！");
        this.$refs.upload.clearFiles();
        this.uploadDialogVisible = false;
      } else {
        this.$message.error("导入失败！错误信息：" + rs.message);
        this.$refs.upload.clearFiles();
      }
    },
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
.el-popover .button-popover {
  text-align: center;
}
</style>
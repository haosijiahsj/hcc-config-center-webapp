<template>
  <div style="text-align: left">
    <el-card shadow="never">
      <div slot="header">
        <span>查询条件</span>
      </div>
      <div>
        <el-form :model="queryForm" :inline="true" size="small">
          <el-form-item label="应用名称">
            <el-input v-model="queryForm.appName" placeholder="应用名称，支持模糊搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryApp">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div>
      <el-card shadow="never">
        <div slot="header">
          <span>应用信息</span>
        </div>
        <el-row>
          <div style="text-align: right">
            <el-button size="mini" @click="saveApp" icon="el-icon-plus">新增</el-button>
          </div>
        </el-row>
        <el-table v-loading="loading" :data="queryResult.data" size="mini" :border="true">
          <el-table-column prop="appCode" label="应用编码"></el-table-column>
          <el-table-column prop="appName" label="应用名称"></el-table-column>
          <el-table-column prop="secretKey" label="密钥" width="260">
          </el-table-column>
          <el-table-column prop="appStatus" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.appStatus == 'ONLINE'" type="success" size="mini">{{ scope.row.appStatusDesc }}
              </el-tag>
              <el-tag v-if="scope.row.appStatus == 'OFFLINE'" type="danger" size="mini">{{ scope.row.appStatusDesc }}
              </el-tag>
              <el-tag v-if="scope.row.appStatus == 'NOT_ONLINE'" type="info" size="mini">{{ scope.row.appStatusDesc }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="appMode" width="120" label="模式">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.appMode == 'LONG_CONNECT'" type="success" size="mini">{{ scope.row.appModeDesc }}
              </el-tag>
              <el-tag v-if="scope.row.appMode == 'LONG_POLLING'" size="mini">{{
                  scope.row.appModeDesc
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="负责人"> </el-table-column>
          <el-table-column prop="createTime" width="140" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" width="140" label="更新时间"></el-table-column>
          <el-table-column prop="operate" width="150" label="操作">
            <template slot-scope="scope">
              <el-button v-if="
                scope.row.appStatus == 'NOT_ONLINE' ||
                scope.row.appStatus == 'OFFLINE'
              " type="text" @click="editApp(scope.row)" size="mini">编辑</el-button>
              <el-button v-if="
                scope.row.appStatus == 'NOT_ONLINE' ||
                scope.row.appStatus == 'OFFLINE'
              " type="text" @click="online(scope.row)" size="mini">上线</el-button>
              <el-button v-if="scope.row.appStatus == 'ONLINE'" type="text" @click="offline(scope.row)" size="mini">下线
              </el-button>
              <el-button v-if="
                scope.row.appStatus == 'NOT_ONLINE' ||
                scope.row.appStatus == 'OFFLINE'
              " :underline="false" type="text" size="mini" class="button-dander" @click="deleteApp(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-class">
          <el-pagination small background @size-change="sizeChange" @current-change="currentChange"
            :current-page="queryResult.page" :page-sizes="[10, 20, 50]" :page-size="queryResult.size"
            layout="total, sizes, prev, pager, next" :total="queryResult.totalSize">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <div>
      <el-dialog :title="saveFormTitle" :visible.sync="saveDialogVisible" width="30%" :close-on-click-modal="false" :destroy-on-close="true">
        <el-form :model="saveForm" ref="saveForm" size="mini" :rules="saveFormRules">
          <el-form-item label="应用编码" label-width="80px" prop="appCode">
            <el-input v-model="saveForm.appCode" :disabled="saveForm.id && saveForm.appStatus != 'NOT_ONLINE'">
            </el-input>
          </el-form-item>
          <el-form-item label="应用名称" label-width="80px" prop="appName">
            <el-input v-model="saveForm.appName"></el-input>
          </el-form-item>
          <el-form-item label="应用模式" label-width="80px">
            <el-radio-group v-model="saveForm.appMode" :disabled="saveForm.id && saveForm.appStatus != 'NOT_ONLINE'"
              size="small">
              <el-radio label="LONG_CONNECT" border>长连接</el-radio>
              <el-radio label="LONG_POLLING" border>长轮询</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="负责人" label-width="80px">
            <el-input v-model="saveForm.owner"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="saveDialogVisible = false" size="mini">取消</el-button>
          <el-button type="primary" @click="saveOrUpdateApp" size="mini">确定</el-button>
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
      loading: false,
      saveDialogVisible: false,
      queryForm: {
        appName: null,
        page: 1,
        size: 10,
      },
      queryResult: {
        page: 1,
        size: 10,
        totalPage: 0,
        totalSize: 0,
        data: [],
      },
      saveFormTitle: "新增应用",
      saveForm: {
        id: null,
        appCode: null,
        appName: null,
        appMode: "LONG_CONNECT",
        owner: null,
      },
      saveFormRules: {
        appCode: [{ required: true, message: "应用编码必填" }],
        appName: [{ required: true, message: "应用名称必填" }],
      },
    };
  },
  mounted() { },
  methods: {
    queryApp() {
      let that = this;
      that.loading = true;
      ajax.post("/application/page", that.queryForm).then((rs) => {
        that.loading = false;
        if (rs.success) {
          that.queryResult = rs.data;
        } else {
          this.$message.error("查询失败！请稍后再试！");
        }
      });
    },
    sizeChange(size) {
      this.queryForm.size = size;
      this.queryApp();
    },
    currentChange(current) {
      this.queryForm.page = current;
      this.queryApp();
    },
    saveApp() {
      this.saveDialogVisible = true;
      this.saveFormTitle = "新增应用";
      this.saveForm = {
        id: null,
        appCode: null,
        appName: null,
        appMode: "LONG_CONNECT",
        owner: null
      };
    },
    editApp(row) {
      this.saveFormTitle = "编辑应用";
      this.saveDialogVisible = true;
      this.saveForm = row;
    },
    online(row) {
      let that = this;
      let msg = "确定要上线应用 <strong>[" + row.appCode + "]</strong> 吗?";
      this.$confirm(msg, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        ajax.get("/application/online/" + row.id).then((rs) => {
          if (rs.success) {
            this.$message.success("上线成功");
            that.queryApp();
          } else {
            this.$message.error("上线失败！错误信息：" + rs.message);
          }
        });
      });
    },
    offline(row) {
      let that = this;
      let msg = "确定要下线应用 <strong>[" + row.appCode + "]</strong> 吗?";
      this.$confirm(msg, "警告", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        ajax.get("/application/offline/" + row.id).then((rs) => {
          if (rs.success) {
            this.$message.success("下线成功");
            that.queryApp();
          } else {
            this.$message.error("下线失败！错误信息：" + rs.message);
          }
        });
      });
    },
    deleteApp(row) {
      let that = this;
      let msg = "确定要删除应用 <strong>[" + row.appCode + "]</strong> 吗?";
      this.$confirm(msg, "警告", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        ajax.get("/application/delete/" + row.id).then((rs) => {
          if (rs.success) {
            this.$message.success("删除成功");
            that.queryApp();
          } else {
            this.$message.error("删除失败！错误信息：" + rs.message);
          }
        });
      });
    },
    saveOrUpdateApp() {
      let that = this;
      this.$refs['saveForm'].validate((valid) => {
        if (valid) {
          ajax.post("/application/save", that.saveForm).then((rs) => {
            if (rs.success) {
              this.$message.success("保存成功");
              that.saveDialogVisible = false;
              that.queryApp();
            } else {
              this.$message.error("保存失败！错误信息：" + rs.message);
            }
          });
        } else {
          return false;
        }
      });
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
  padding: 10px 20px;
  font-weight: bold;
  font-size: 14px;
}

.page-class {
  margin-bottom: 5px;
  text-align: right;
}

.button-dander {
  color: #f56c6c;
}

.button-dander :focus,
.button-dander:hover {
  color: #f78989;
}
</style>
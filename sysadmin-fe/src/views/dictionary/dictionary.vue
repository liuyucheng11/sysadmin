<template>
  <div>

    <el-select allow-create v-model="codeId" filterable placeholder="请选择" @change="getData()">
      <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value">
      </el-option>
    </el-select>

    <!-- 演示使用
    <el-select v-model="testCodeId" filterable placeholder="请选择" @change="testShow()">
      <el-option v-for="item in testData" :label="item.codeKey" :value="item.codeValue">
      </el-option>
    </el-select> -->


    <el-button type="primary" icon="el-icon-plus" @click="newData()">添加</el-button>

    <el-table :data="tableData.filter(data => !search || data.codeKey.toLowerCase().includes(search.toLowerCase()))"
      style="width: 95%">
      <el-table-column type="index" width="100%">
      </el-table-column>
      <el-table-column label="codeKey" prop="codeKey">
      </el-table-column>
      <el-table-column label="codeValue" prop="codeValue">
      </el-table-column>
      <el-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注:" width="250" trigger="hover">
            <div>{{scope.row.remark}}</div>
            <span v-if="scope.row.remark.length>10" slot="reference">{{scope.row.remark.substr(0,10)}}....</span>
            <span v-else slot="reference">{{scope.row.remark}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入codeKey搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 编辑弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="editVisible">
      <el-form :model="dictionary" label-width="25%" style="width: 100%;">
        <el-form-item label="codeId：">
          <el-input v-model="dictionary.codeId" style="width: 80%;" :disabled="true" />
        </el-form-item>
        <el-form-item label="codeKey：">
          <el-input v-model="dictionary.codeKey" style="width: 80%;" />
        </el-form-item>
        <el-form-item label="codeValue：">
          <el-input v-model="dictionary.codeValue" style="width: 80%;" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="dictionary.remark" style="width: 80%;" />
        </el-form-item>
      </el-form>
      <el-row style="text-align: center;margin-top: 100px">
        <el-button icon="el-icon-close" style="margin-right: 10px" @click="editVisible=false">取消</el-button>
        <el-button type="primary" icon="el-icon-upload" style="margin-left: 10px" @click="saveOrUpdate(dictionary)">提交
        </el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import {
    ajaxParams,
    ajaxData
  } from "../../api/dictionary";

  export default {
    name: "demo",
    data() {
      return {
        // TODO 可以 删除
        testCodeId:'',
        testData: [],

        data: [],
        options: [],
        codeId: '',
        search: '',
        editVisible: false,
        dictionary: {
          id: null,
          codeId: '',
          codeKey: '',
          codeValue: '',
          remark: ''
        },
        dialogTitle: '数据字典',
        tableData: [],
        name: ''
      }
    },
    methods: {
      getOptions() {
        let this_ = this;
        // 取得所有数据
        ajaxParams('/dictionary/getOptions').then((result) => {
          // 赋值给数据表格
          this_.options = result.data.options;
          if (this_.options.length > 0) {
            this_.codeId = this_.options[0]["label"];
            this_.getData();
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      // 加载数据表格
      getData() {
        let this_ = this;
        let params = {
          codeId: this_.codeId
        };
        // 取得所有数据
        ajaxParams('/dictionary/getListByCodeId', params).then((result) => {
          // 赋值给数据表格
          this_.tableData = result.data.dictionaries;
        }).catch((error) => {
          console.log(error);
        });
      },

      // ######################演示方法开始##############################
      testShow(){
        alert(this.testCodeId);
      },
      testGet() {
        let params = {
          codeId: 'userApplyType'
        };
        // 取得所有数据
        ajaxParams('/dictionary/getListByCodeId', params).then((result) => {
          let this_ = this;
          // 赋值给数据表格
          this_.testData = result.data.dictionaries;
        }).catch((error) => {
          console.log(error);
        });
      },
      // ######################演示方法结束##############################
      newData() {
        let this_ = this;
        this_.dialogTitle = "添加新数据字典";
        this_.dictionary.codeId = this_.codeId;
        this_.dictionary.id = null;
        // 显示编辑框
        this_.editVisible = true;
      },
      handleEdit(id) {
        let this_ = this;
        this_.dialogTitle = "修改数据字典";
        let params = {
          id: id
        };
        ajaxParams("/dictionary/getEntityById", params).then((result) => {
          // 将数据绑定到dictionary上
          this_.dictionary = result.data.dictionary;
        }).catch((error) => {
          console.log(error);
        });
        // 显示编辑框
        this_.editVisible = true;
      },
      saveOrUpdate(dictionary) {
        let this_ = this;
        if (dictionary.codeKey == "" || dictionary.codeValue == "") {
          this_.$message({
            type: 'warring',
            message: '请填写完整!'
          });
          return;
        }
        ajaxData('/dictionary/saveOrUpdate', dictionary).then((result) => {
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '操作成功!'
            });
          };
          // 赋值给数据表格
          this_.editVisible = false;
          if (this_.tableData.length == 0) {
            this_.getOptions();
          }
          this_.codeId = dictionary.codeId;
          // this_.getOptions();
          this_.getData();
        }).catch((error) => {
          console.log(error);
        });
      },
      handleDelete(id) {
        let this_ = this;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '狠心删除',
          cancelButtonText: '手滑了',
          type: 'warning'
        }).then(() => {
          let params = {
            id: id
          };
          ajaxParams("/dictionary/changeActive", params).then((result) => {
            if (this_.tableData.length - 1 == 0) {
              this_.getOptions();
            };
            // 重新加载数据
            this_.getData();
          }).catch((error) => {
            console.log(error);
          });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    mounted() {
      this.getOptions();
      // TODO 可以 删除
      this.testGet();
    },
    activated() {}
  }
</script>

<style lang="scss" scoped>
  .form {
    padding: 20px;

    .input {
      width: 30%;
    }
  }
</style>

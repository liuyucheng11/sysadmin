<template>
  <div id="swagger">
    <div class="form">
      <div class="factor">
        角色申请编号:
        <el-input
          v-model="staffNumber"
          placeholder="角色申请编号"
          class="input"
        ></el-input>&nbsp;
      </div>
      <div class="factor">
        申请角色ID:
        <el-input
          v-model="staffName"
          placeholder="申请角色ID"
          class="input"
        ></el-input>&nbsp;
      </div>
      <div class="factor">
        申请角色名称:
        <el-input
          v-model="accountNo"
          placeholder="申请角色名称"
          class="input"
        ></el-input>
      </div>
      <div class="factor">
        申请人登录账号：
        <el-input
          v-model="accountNo"
          placeholder="申请人登录账号"
          class="input"
        ></el-input>
      </div>
    </div>
    <div class="form">
       <div class="factor">
        申请人员工编号:
        <el-input
          v-model="accountNo"
          placeholder="申请人员工编号"
          class="input"
        ></el-input>
      </div>
      <div class="factor">
        申请人员工姓名：
        <el-input
          v-model="accountNo"
          placeholder="申请人员工姓名"
          class="input"
        ></el-input>
      </div>
      <div class="factor">
        申请人所属部门
        <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="info" plain @click=" empty">重置</el-button>
      </div>
    
      <div class="factor">
          状态：
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
      </div>
    </div>

    <div class="form">
        <div>
      <div class="block">
    <span class="demonstration">申请时间</span>
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>

  </div>
      
      
    </div>
    <div class="btnRow">
      <el-button
        type="primary"
        @click="getStaff"
        class="selectbtn"
      >查询</el-button>
      <el-button
        type="primary"
        @click=""
        class="exportbtn"
      >导出</el-button>
    </div>
    <div class="form">
      <el-row>
        <el-button  type="primary" round @click="add">新建</el-button>
        <el-button
          type="primary"
          round
        >修改</el-button>
        <el-button
          type="danger"
          round
        >删除</el-button>
        <el-button
          type="primary"
          round
        >提交审核</el-button>
      </el-row>

    </div>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="250"
    >
      <el-table-column
        label="选择"
        width="90"
        type="selection"
        fixed
      >
      </el-table-column>
      <el-table-column
        prop="staffNumber"
        label="申请编号"
        width="90"
      >
        <template slot-scope="scope">
          <a
            :href="'http://www.baidu.com?staffNum='+scope.row.staffNumber"
            target="_blank"
            class="buttonText"
          >{{scope.row.staffNumber}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="accountNo"
        label="角色ID"
      >
      </el-table-column>
      <el-table-column
        prop="staffName"
        label="角色名称"
      >
      </el-table-column>
      <el-table-column
        prop="staffSex"
        label="审批负责人"
      >
      </el-table-column>
      <el-table-column
        prop="staffTelephone"
        label="角色支持业务线"
      >
      </el-table-column>
      <el-table-column
        prop="staffEmail"
        label="申请人登录账号"
      >
      </el-table-column>
      <el-table-column
        prop="departmentCode"
        label="申请人员工编号"
      >
      </el-table-column>
      <el-table-column
        prop="superiorDepartmentCode"
        label="申请人员工姓名"
      >
      </el-table-column>
      <el-table-column
        prop="staffIsLeft"
        label="申请人"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStaffSingle } from "../../api/staff";
export default {
  name: "staffSingle",
  components: {},
  props: {},
  data() {
    return {
      id: 1,
      totalCount: 0,
      pageSize: 0,
      totalPage: 0,
      currentPage: 0,
      limit: 10,
      startIndex: 0,
      staffNumber: "",
      accountNo: "",
      staffName: "",
      staffSex: "",
      staffTelephone: "",
      staffEmail: "",
      departmentCode: "",
      superiorDepartmentCode: "",
      staffLeft: "",
      tableData: [],
      multipleSelection: [],
      options: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '已新建'
        }, {
          value: '选项3',
          label: '待审批'
        }, {
          value: '选项4',
          label: '审批通过'
        }, {
          value: '选项5',
          label: '审批拒绝'
        },{
          value: '选项6',
          label: '已删除'
        }],
    value: '全部',
    pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        value2: ''
        
    };
    
    
  },
  watch: {},
  computed: {},
  methods: {
    empty() {
        this.value = "全部"
    },
    add() {
        this.$router.push('/role/add')
    },
    getData() {
      let this_ = this;
      let param = {
        staffName: this_.staffName,
        staffNumber: this_.staffNumber,
        currentPage: this_.currentPage,
        accountNo: this_.accountNo,
        limit: this_.limit
      };
      getStaffSingle(JSON.stringify(param))
        .then(result => {
          this_.tableData = result.data.list;
          this_.currentPage = result.data.currentPage;
          this_.totalCount = result.data.totalCount;
          this_.totalPage = result.data.totalPage;
          this.pageSize = result.data.pageSize;
          console.log(this_.tableData);
        })
        .catch(error => {
          console.log(error);
          alert(error);
        });
    },
    getStaff() {
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.form {
  font-size: 12px;
  padding: 20px;
  .factor {
    float: left;
    padding-left: 10px;
  }
  .input {
    height: 12px;
    width: 170px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
.btnRow {
  padding: 10px;
  text-align: center;
}
.selectbtn {
  margin-left: auto;
  margin-right: auto;
}
.exportbtn {
  margin-left: auto;
  margin-right: auto;
}
</style>
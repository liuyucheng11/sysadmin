<template>
  <div id="swagger">

    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      :inline="true"
      ref="formLabelAlign"
    >

      <h4>基本信息</h4>
      <hr>

      <el-form-item
        label="员工编号:"
        prop="staffNumber"
        class="item"
        :rules="rules.NumberTrue"
      >
        <el-input
          v-model.trim="formLabelAlign.staffNumber"
          placeholder="请输入员工编号"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工姓名:"
        prop="staffName"
        class="item"
        :rules="rules.nameTrue"
      >
        <el-input
          v-model.trim="formLabelAlign.staffName"
          placeholder="请输入员工姓名"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工邮箱:"
        prop="staffEmail"
        class="item"
        :rules="rules.emailFalse"
      >
        <el-input
          v-model.trim="formLabelAlign.staffEmail"
          placeholder="请输入员工邮箱"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="所属部门:"
        prop="departmentId"
        class="item"
        :rules="rules.requiredTrue"
      >
        <el-input
          style="width: 230px;"
          v-model.trim="formLabelAlign.departmentName"
          :rules="rules.requiredTrue"
          :readonly="true"
        ></el-input>
        <el-button
          type="primary"
          @click="selectDept"
          class="departmentBt"
          v-permission="['/staff/new/new']"
        >选择</el-button>
      </el-form-item>&nbsp;

      <el-form-item
        label="登录账号:"
        class="item"
      >
        <el-input
          v-model.trim="formLabelAlign.accountNo"
          placeholder="请输入登陆账号"
          prefix-icon="el-icon-search"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="是否离职:"
        class="item"
      >
        <el-select
          v-model="formLabelAlign.staffIsLeft"
          placeholder="请选择"
          style="width:300px"
          :disabled="true"
        >       
          <el-option
            v-for="item in getIsLeftEnum()"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >             
             </el-option>       
             </el-select>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工手机:"
        prop="staffTelephone"
        class="item"
        :rules="rules.phoneTrue"
      >
        <el-input
          v-model.trim="formLabelAlign.staffTelephone"
          placeholder="请输入员工手机"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工性别:"
        class="item"
      >
        <div class="rad">
          <el-radio-group v-model="formLabelAlign.staffSex">
            <el-radio
              :label="item.key"
              :key="item.key"
              v-for="item in getSexEnum()"
            >{{item.value}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <h4>其他信息</h4>
      <hr>

      <el-form-item
        label="新建时间:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.createTime"
          placeholder="新建时间"
          prefix-icon="el-icon-search"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="新建人:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.createEmp"
          placeholder="新建人"
          prefix-icon="el-icon-search"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="修改时间:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.modifyTime"
          placeholder="修改时间"
          prefix-icon="el-icon-search"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="修改人:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.modifyEmp"
          placeholder="修改人"
          prefix-icon="el-icon-search"
          class="input"
          :disabled="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="备注:"
        class="item"
        prop="remark"
        :rules="rules.remark"
      >
        <el-input
          v-model.trim="formLabelAlign.remark"
          placeholder="备注"
          prefix-icon="el-icon-search"
          class="input"
          style="width:737px"
        ></el-input>
      </el-form-item>&nbsp;

    </el-form>

    <div class="btnRow">
      <el-button
        type="primary"
        @click="submitForm('formLabelAlign')"
        class="selectbtn"
        v-permission="['/staff/new/new']"
      >保存</el-button>
      <el-button
        type="primary"
        @click="toIndex"
        class="exportbtn"
        v-permission="['/staff/new/new']"
      >取消</el-button>
    </div>

    <div>
      <el-dialog
        title="请选择部门"
        :visible.sync="dialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="commitSelectDept()"
            v-permission="['/staff/new/new']"
          >确定</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectDept()"
            v-permission="['/staff/new/new']"
          >取消</el-button>
        </el-row>
        <department-tree
          :return-name="true"
          @selectId="changeDeptId"
          :clear-choose="clearChoose"
          @clear="clear"
        ></department-tree>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { insertStaff } from "../../api/staff";
import DepartmentTree from "../department/departmentTree";
import rules from "@/utils/rules";
import { getDictName, getEnum } from "./enumUtil";

export default {
  name: "insertStaff",
  components: { DepartmentTree },
  props: {},
  data() {
    return {
      rules,
      clearChoose: false,
      labelPosition: "right",
      dialogVisible: false,
      formLabelAlign: {
        staffNumber: "",
        staffName: "",
        staffSex: "",
        staffTelephone: "",
        staffEmail: "",
        staffIsLeft: 0,
        accountNo: "",
        status: 1,
        departmentId: "",
        departmentName: "",
        remark: "",
        createEmp: "",
        createTime: "",
        modifyEmp: "",
        modifyTime: ""
      },
      departId: "",
      departName: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    insertData() {
      let this_ = this;
      insertStaff(this_.formLabelAlign)
        .then(result => {
          if (result.code == 500) {
            this.$message("新建失败！" + result.message);
          } else {
            this.$message("新建成功");
            this.toIndex();
          }
        })
        .catch(error => {
          console.log(error);
          this.$message("新建失败！" + error);
        });
    },

    selectDept() {
      this.dialogVisible = true;
    },
    cancelSelectDept() {
      this.formLabelAlign.departmentName = null;
      this.formLabelAlign.departmentId = null;
      this.clearChoose = true;
      this.dialogVisible = false;
    },
    commitSelectDept() {
      this.formLabelAlign.departmentId = this.departId;
      this.formLabelAlign.departmentName = this.departName;
      this.clearChoose = true;
      this.dialogVisible = false;
    },
    changeDeptId(val) {
      this.departId = val.id;
      this.departName = val.name;
      // this.formLabelAlign.departmentId = val.id;
      // this.formLabelAlign.departmentName = val.name;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.insertData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getIsLeftEnum() {
      return getEnum("isLeft");
    },
    getSexEnum() {
      return getEnum("sex");
    },
    toIndex() {
      // this.clear();
      // this.$router.go(0);
      console.log("to index");
      this.$store.dispatch("tagsView/delVisitedView", this.$route);

      this.$router.push({ name: "staffIndex" });
      // this.$router.go(-1);
    },
    clear1() {
      this.formLabelAlign.staffNumber = "";
      this.formLabelAlign.staffName = "";
      this.formLabelAlign.staffTelephone = "";
      this.formLabelAlign.staffEmail = "";
      this.formLabelAlign.remark = "";
      this.formLabelAlign.departmentName = "";
      this.formLabelAlign.departmentId = "";
    },
    clear(val) {
      if (val) {
        this.clearChoose = false;
      }
    }
  },
  created() {
    console.log("---------------------------------");
    this.clear1();
  },
  mounted() {
    // 只能获取一次（刷新失效）
    // this.createEmp = this.$store.getters.nowLogin.id;
    // this.modifyEmp = this.$store.getters.nowLogin.id;
  }
};
</script>
<style lang="scss" scoped>
h4 {
  padding-left: 30px;
}
.input {
  height: 12px;
  width: 300px;
}
.item {
  padding-left: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.btnRow {
  padding: 20px;
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
.departmentBt {
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  width: 65px;
  height: 36px;
  vertical-align: middle;
}
</style>

<template>
  <div id="swagger">

    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      :inline="true"
    >

      <h4>基本信息</h4>
      <hr>

      <el-form-item
        label="员工编号:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.staffNumber"
          placeholder="请输入员工编号"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工姓名:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.staffName"
          placeholder="请输入员工姓名"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工邮箱:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.staffEmail"
          placeholder=""
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="所属部门:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.departmentName"
          placeholder="员工部门"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="上级部门:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.parentDepartmentName"
          placeholder=""
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="登录账号:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.accountNo"
          placeholder=""
          class="input"
          :readonly="true"
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
        class="item"
      >
        <el-input
          v-model="formLabelAlign.staffTelephone"
          placeholder="请输入员工手机"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="员工性别:"
        class="item"
      >
        <div class="rad">
          <el-radio-group v-model="formLabelAlign.staffSex" >
            <el-radio
              :label="item.key"
              :key="item.key"
              v-for="item in getSexEnum()"
              :disabled="true"
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
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="新建人:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.createEmpAccount"
          placeholder="新建人"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="修改时间:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.modifyTime"
          placeholder="修改时间"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="修改人:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.modifyEmpAccount"
          placeholder="修改人"
          class="input"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

      <el-form-item
        label="备注:"
        class="item"
      >
        <el-input
          v-model="formLabelAlign.remark"
          placeholder=""
          class="input"
          style="width:737px"
          :readonly="true"
        ></el-input>
      </el-form-item>&nbsp;

    </el-form>

    <div class="btnRow">
      <el-button
        type="primary"
        @click="toIndex"
        class="exportbtn"
      >返回</el-button>
    </div>

  </div>
</template>

<script>
import { selectById } from "../../api/staff";
import { getDictName, getEnum } from "./enumUtil";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      labelPosition: "right",
      id:"",
      formLabelAlign: {
        // staffNumber: "",
        // staffName: "",
        // staffSex: "",
        // staffTelephone: "",
        // staffEmail: "",
        // staffIsLeft:"0",
        // accountNo: "",
        // remark: "",
        // createTime: "",
        // modifyEmp: "",
        // modifyTime: "",
        // createEmpAccount: "",
        // modifyEmpAccount: "",
        // departmentName: "",
        // parentDepartmentName: ""
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    getIsLeftEnum() {
      return getEnum("isLeft");
    },
    getSexEnum() {
      return getEnum("sex");
    },
    toIndex() {
      this.$store.dispatch("tagsView/delVisitedView", this.$route);
      this.$router.go(-1);
      // this.$router.push({ name: "staffIndex" });
    }
  },
  created() {},
  mounted() {
    let id = this.$route.query.id;
    if (id != null) {
    selectById({id:id})
      .then(result => {
        this.formLabelAlign = result.data;
      })
      .catch(error => {
        console.log(error);
        this.$message(error);
      });
    }
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
.rad {
  width: 500px;
}
.btnRow {
  padding: 20px;
  text-align: center;
}
.exportbtn {
  margin-left: auto;
  margin-right: auto;
}
</style>
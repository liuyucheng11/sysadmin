<template>
    <el-container>
      <el-aside class="left">
        <el-header >
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add"
                     v-permission="['/cityManage/cityManage/add']" :disabled="this.visibles.addDisable">新增
          </el-button>
          <el-button type="warning" size="small" icon="el-icon-edit-outline"
                     v-permission="['/cityManage/cityManage/update']" :disabled="this.visibles.editDisable"
                     @click="edit">修改
          </el-button>
        </el-header>
        <el-row class="left-head"><span style="color: red; font-size: 5px"><i class="el-icon-info"></i>红色字体表示无效城市</span></el-row>
        <el-main>
          <city-tree @select="changeCityId" ref="cityTree"></city-tree>
        </el-main>
      </el-aside>
      <el-main style="text-align: center;">
        <el-card v-if="!isEmpty(selectCityId)||visibles.addDisable">
          <el-form :model="city"  :rules="confirmRules" ref="city"  size="small" label-width="120px" label-position="right">
            <el-row class="form-row">
                <el-form-item label="国际代码：" prop="code">
                  <el-input v-model="city.code" :disabled="!visibles.editDisable" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-row>
              <el-row class="form-row">
                <el-form-item label="名称：" prop="cnName">
                  <el-input v-model="city.cnName" :disabled="!visibles.editDisable" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-row>
              <el-row class="form-row">
                <el-form-item label="拼音全称：" >
                  <el-input v-model="city.enName" :disabled="!visibles.editDisable"  clearable></el-input>
                </el-form-item>
              </el-row>
              <el-row class="form-row">
                <el-form-item label="地区类型：">
                  <el-select style="display: block" :disabled="true" v-model="city.type" >
                    <el-option v-for="item in getTypeEnum()"
                               :key="item.key"
                               :value="item.key"
                               :label="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row class="form-row"  v-if="!isEmpty(parentName)">
                <el-form-item label="归属地区：">
                  <el-input v-model="parentName"  :disabled="true"></el-input>
                </el-form-item>
              </el-row>
              <el-row class="form-row">
                <el-form-item label="状态：" prop="status">
                  <el-select style="display: block" :disabled="!visibles.editDisable" v-model="city.status"  clearable filterable placeholder="请选择">
                    <el-option v-for="item in getStatusEnum()"
                               :key="item.key"
                               :value="item.key"
                               :label="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            <el-row class="form-row">
              <el-form-item label="创建人：">
                <el-input v-model="city.createEmpName" :disabled="true"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="form-row">
              <el-form-item label="创建时间：">
                <el-input v-model="city.createTime"  :disabled="true"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="form-row">
              <el-form-item label="修改人：">
                <el-input v-model="city.modifyEmpName" :disabled="true"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="form-row">
              <el-form-item label="修改时间：">
                <el-input v-model="city.modifyTime" :disabled="true"></el-input>
              </el-form-item>
            </el-row>
              <el-row class="form-row">
                <el-form-item v-if="this.visibles.save">
                  <el-button  @click="cancel" icon="el-icon-remove-outline" >取消</el-button>
                  <el-button type="primary" icon="el-icon-check" :disabled="visibles.saveDisable"  @click="onSubmit()">保存</el-button>
                </el-form-item>
              </el-row>
          </el-form>
        </el-card>
      </el-main>

    </el-container>
</template>

<script>
  import {getEnum} from "./enumUtil";
  import {cityApi} from "../../api/city";
  import { parseTime } from '@/utils'
  import CityTree from "./components/city-tree";

  export default {
    components: {CityTree},
      data() {
        return {
          city: {
            id: '',
            code: '',
            cityName: '',
            cnName: '',
            enName: '',
            status: '',
            createEmpName: '',
            createTime: '',
            modifyEmpName: '',
            modifyTime: '',
            type: '',
            level: '',
            parentId: ''
          },
          parentName: '',
          visibles: {
            save: false,
            editDisable: true,
            addDisable: false,
            saveDisable: false
          },
          selectCityId: '',
          selectCityCnName: '',
          selectCityType: '',
          selectCityLevel: '',
          //formHistore用于点击取消后恢复原表单数据
          formHistory: '',
          confirmRules: {
            code: [
              {required: true, message: '请填写国际代码', trigger: 'blur'},
              {
                pattern: /^[0-9]{6}$/,
                message: '代码只能为6位数字',
                trigger: 'blur'
              }
            ],
            cnName: [
              {required: true, message: '请填写名称', trigger: 'blur'},
            ],
            status: [
              {required: true, message: '请设置有效性', trigger: 'blur'},
            ]
          }

        }
      },
    watch: {
      selectCityId (val) {
        this.visibles.save = false
        this.visibles.editDisable = false
        this.visibles.addDisable =false
        if((val && this.city.level == 3) ||( this.city.status == 0 )){ //第三层节点不能继续新建子节点|| 失效城市不能新建子节点
          this.visibles.addDisable = true
        }
        if(this.isEmpty(val)){ //没有选择节点时不允许修改
          this.visibles.editDisable = true
        }

      }
    },
    methods: {
      getStatusEnum(){
        return getEnum('status')
      },
      getTypeEnum(){
        return getEnum('type')
      },
      cancel(){
        this.visibles.save = false
        this.visibles.addDisable = false
        if(this.selectCityId) {
          this.city = JSON.parse(this.formHistory)
          this.visibles.editDisable = false
        }
        if(( this.city.level != 3) && ( this.city.status != 0 )) { //第三层节点不能继续新建子节点|| 失效城市不能新建子节点
          this.visibles.addDisable = false
        }
      },
      edit(){
        this.city.id = this.selectCityId
        this.visibles.save = true
        this.visibles.editDisable = true
        this.visibles.addDisable = true
      },
      add(){
        this.visibles.addDisable = true
        this.visibles.save = true
        this.visibles.editDisable = true
        if(this.isEmpty(this.selectCityId)){
          this.city.type = 1
          this.city.level = 1
          this.city.parentId = -1
        }else {
          this.city.type = 1 + this.selectCityType
          this.city.level = 1 + this.selectCityLevel
          this.city.parentId = this.selectCityId
          this.parentName = this.selectCityCnName
        }
        this.city.id = ''
        this.city.code = ''
        this.city.status = ''
        this.city.cnName = ''
        this.city.enName = ''
        this.city.createEmpName = ''
        this.city.createTime = ''
        this.city.modifyTime = ''
        this.city.modifyEmpName = ''

      },
      isEmpty(obj){
        if(typeof obj == "undefined" || obj == null || obj == ""){
          return true;
        }else{
          return false;
        }
      },
      changeCityId(val){
        this.formHistory = JSON.stringify(val.data)
        this.selectCityId = val.id
        this.parentName = val.data.parentName
        this.selectCityType = this.city.type = val.data.type
        this.city.enName = val.data.enName
        this.selectCityCnName = this.city.cnName = val.data.cnName
        this.city.createTime = val.data.createTime
        this.city.createEmpName = val.data.createEmpName
        this.city.modifyTime = val.data.modifyTime
        this.city.modifyEmpName = val.data.modifyEmpName
        this.city.code = val.data.code
        this.city.status = val.data.status
        this.selectCityLevel = this.city.level = val.data.level
        this.city.parentId = val.data.parentId
        //console.log(val)
      },
      onSubmit() {
        this.visibles.saveDisable = true
        this.$refs['city'].validate((valid) => {
          if (valid) {
            this.submit()
          } else {
            this.visibles.saveDisable = false
            return true
          }
        });
      },
      submit() {
        if(this.isEmpty(this.city.id)){ //add
          cityApi.create(this.city).then(res=>{
            if(res.data){
              this.visibles.saveDisable = false
              this.visibles.editDisable = false
              this.visibles.save = false
              this.city.id = res.data
              this.city.modifyEmpName = this.$store.getters.nowLogin.accountNo
              this.city.modifyTime = parseTime(new Date().getTime())
              this.city.createEmpName = this.$store.getters.nowLogin.accountNo
              this.city.createTime = parseTime(new Date().getTime())
              console.log("newID:" + this.city.id)
              this.$refs.cityTree.addNode(this.city)
            }
          }).catch(()=>{
            this.visibles.saveDisable = false
          })
        }else{                 //add
          cityApi.update(this.city).then(res=>{
            if(res.data){
              this.visibles.saveDisable = false
              this.visibles.editDisable = false
              this.visibles.save = false
              this.city.modifyEmpName = this.$store.getters.nowLogin.accountNo
              this.city.modifyTime = parseTime(new Date().getTime())
              console.log(this.city)
              this.$refs.cityTree.updateNode(this.city)
            }
          }).catch(()=>{
            this.visibles.saveDisable = false
          })
        }
        if(( this.city.level != 3) && ( this.city.status != 0 )) { //第三层节点不能继续新建子节点|| 失效城市不能新建子节点
          this.visibles.addDisable = false
        }

      }

    }

    }
</script>

<style scoped>
  .module {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 20px;
  }
  .form-row{
    margin-top: 0.2em;
    width: 80%;
  }
  .left{
    text-align: center;
    border-right: 1px solid #ddd;
    min-height: 600px;
  }
  .el-button{
    margin-top: 20px;
  }
  .left-head{
    border-bottom: 1px solid #ddd;
  }
</style>

<template>
  <div style="margin-bottom: 100px">
    <div>
      <el-form label-width="25%" :model="departmentInfo" ref="departmentInfo" :rules="rules">
        <el-card class="module">
          <el-row class="row-title">
            <el-col :xs="6" :sm="4" :xl="2">
              <h2>基本信息</h2>
            </el-col>
            <el-col :xs="18" :sm="20" :xl="10" style="text-align: right">
              <el-form-item>
                <el-button type="primary" style="margin: 10px" @click="commit('departmentInfo')">提交</el-button>
                <el-button type="primary" style="margin: 10px" @click="cancel">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="部门编号" prop="code">
                <el-input v-model="departmentInfo.code" :disabled="type===1" clearable>
                  <el-select v-model="codePrefix" slot="prepend" placeholder="请选择" :disabled="type===1"
                             style="width: 90px">
                    <el-option label="Z" value="Z"></el-option>
                    <el-option label="F" value="F"></el-option>
                    <el-option label="G" value="G"></el-option>
                    <el-option label="Q" value="Q"></el-option>
                    <el-option label="B" value="B"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="departmentInfo.name" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="20" :sm="10" :xl="5">
              <el-form-item label="负责人ID" label-width="30%">
                <el-input v-model="departmentInfo.leaderId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="2" :xl="1">
              <el-form-item label-width="10%">
                <el-button type="primary" style="width: 100%" @click="chooseLeader">选择</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="负责人姓名">
                <el-input v-model="departmentInfo.leaderName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="departmentInfo.mobile" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="departmentInfo.email" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="座机号" prop="telephone">
                <el-input v-model="departmentInfo.telephone" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="所在城市" prop="cityId">
                <el-select v-model="departmentInfo.cityId"
                           filterable
                           remote
                           clearable
                           placeholder="请输入所在城市"
                           :remote-method="getCityList"
                           :loading="loading" style="width: 100%;">
                  <el-option v-for="item in cityList"
                             :key="item.id"
                             :label="item.cnName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="20" :sm="22" :xl="11">
              <el-form-item label="详细地址" label-width="13.6%" prop="address">
                <el-input v-model="departmentInfo.address"
                          :disabled="departmentInfo.cityId === null" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="2" :xl="1">
              <el-form-item label-width="10%">
                <el-button type="primary" style="width: 100%" @click="openMap"
                           :disabled="departmentInfo.cityId === null">选择
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="经度" prop="lng">
                <el-tooltip :disabled="departmentInfo.cityId !== null" content="请先选择所在城市" placement="bottom"
                            effect="light">
                  <el-tooltip :disabled="lngPrefix !== 0 || departmentInfo.cityId === null"
                              content="请选择东西经" placement="bottom" effect="light">
                    <el-input v-model="departmentInfo.lng"
                              :disabled="lngPrefix === 0 || lngPrefix === null || departmentInfo.cityId === null"
                              clearable>
                      <el-select v-model="lngPrefix" slot="prepend" placeholder="请选择"
                                 :disabled="departmentInfo.cityId === null"
                                 style="width: 90px">
                        <el-option label="请选择" :value="0"></el-option>
                        <el-option label="E" :value="1"></el-option>
                        <el-option label="W" :value="-1"></el-option>
                      </el-select>
                    </el-input>
                  </el-tooltip>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="纬度" prop="lat">
                <el-tooltip :disabled="departmentInfo.cityId !== null" content="请先选择所在城市" placement="bottom"
                            effect="light">
                  <el-tooltip :disabled="latPrefix !== 0 || departmentInfo.cityId === null"
                              content="请选择南北纬" placement="bottom" effect="light">
                    <el-input v-model="departmentInfo.lat"
                              :disabled="latPrefix === 0 || departmentInfo.cityId === null"
                              clearable>
                      <el-select v-model="latPrefix" slot="prepend" placeholder="请选择"
                                 :disabled="departmentInfo.cityId === null"
                                 style="width: 90px">
                        <el-option label="请选择" :value="0"></el-option>
                        <el-option label="N" :value="1"></el-option>
                        <el-option label="S" :value="-1"></el-option>
                      </el-select>
                    </el-input>
                  </el-tooltip>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="module">
          <el-row class="row-title">
            <h2>业务信息</h2>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="部门级别" prop="level">
                <el-select v-model="departmentInfo.level" placeholder="请选择部门级别" style="width: 100%"
                           :disabled="type===1">
                  <el-option v-for="item in levelList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="上级部门">
                <el-input v-model="departmentInfo.parentDepartmentName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :xl="12">
              <el-form-item label="支持业务线" label-width="12.5%" prop="businessLine">
                <el-checkbox-group v-model="departmentInfo.businessLine" style="width: 100%">
                  <el-checkbox v-for="businessLine in departmentInfo.supportBusinessLine"
                               :label="businessLine.id"
                               :key="businessLine.id">
                    {{businessLine.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="officePoint">
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="部门类型" prop="type">
                <el-select v-model="departmentInfo.type" placeholder="请选择部门类型" style="width: 100%" :disabled="type===1">
                  <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="办公点标识" prop="flag">
                <el-input v-model="departmentInfo.flag" clearable :disabled="type===1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="module">
          <el-row class="row-title">
            <h2>其他信息</h2>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="新建时间">
                <el-input v-model="departmentInfo.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="新建人">
                <el-input v-model="departmentInfo.createEmpName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="修改时间">
                <el-input v-model="departmentInfo.modifyTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="修改人">
                <el-input v-model="departmentInfo.modifyEmpName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :xl="6">
              <el-form-item label="状态">
                <el-input v-model="getDepartmentStatus" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :xl="12">
              <el-form-item label="备注" label-width="12.5%" prop="remark">
                <el-input v-model="departmentInfo.remark" clearable :disabled="type===1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-dialog title="请选择详细地址"
                   :visible.sync="mapVisible">
          <el-card>
            <drag-map :lat="departmentInfo.lat" :lng="departmentInfo.lng" @drag="getAddress"
                      style="width: 100%;height: 500px"></drag-map>
            <div style="margin: 20px">已选择地址：{{mapAddress.address}}</div>
            <div>
              <el-button type="primary" @click="confirmAddress">确定</el-button>
            </div>
          </el-card>
        </el-dialog>
        <el-dialog title="请选择部门负责人"
                   width="80%"
                   :visible.sync="leaderVisible">
          <select-staff @leader="selectStaff" @dialogVisible="changeLeaderVisible"></select-staff>
        </el-dialog>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {Message} from "element-ui";
  import {addDepartment, getDepartmentInfo, queryCity, updateDepartment} from "../../api/department";
  import departmentEnum from "./departmentEnum";
  import DragMap from "../../components/Map/dragMap";
  import SelectStaffForm from "../accountManage/components/selectStaffForm";
  import SelectStaff from "./selectStaff";

  export default {
    name: "detail",
    components: {SelectStaff, SelectStaffForm, DragMap},
    data() {
      let validateAddress = (rule, value, callback) => {
        if (this.departmentInfo.level === departmentEnum.level.getValueByFiledName('B')) {
          if (value === null || value === '') {
            callback(new Error('部门级别为办公点时详细地址必填！'))
          } else {
            let cityName
            if (this.cityList.length > 0) {
              for (let i = 0; i < this.cityList.length; i++) {
                if (this.cityList[i].id === this.departmentInfo.cityId) {
                  cityName = this.cityList[i].cnName
                  break
                }
              }
              if (value.indexOf(cityName) === -1) {
                callback(new Error('详细地址不在所在城市\"' + cityName + '\"内'))
              } else {
                callback()
              }
            }
          }
        } else {
          callback()
        }
      }
      let validateLng = (rule, value, callback) => {
        let pattern = /^[1-9]\d{0,2}(\.\d{1,10})?$|^0(\.\d{1,10})?$/
        if (this.departmentInfo.level === departmentEnum.level.getValueByFiledName('B')) {
          if (value === null || value === '') {
            callback(new Error('部门级别为办公点时详细地址必填！'))
          }
        } else {
          if (value === null || value === '') {
            callback()
          }
        }
        let test = new RegExp(pattern)
        if (!test.test(value)) {
          callback(new Error('经纬度格式错误！'))
        }
        if (value !== null || value !== '') {
          if (this.lngPrefix === 0) {
            callback(new Error('请选择东西经'))
          }
        }
        if (value > 180 || value < 0) {
          callback(new Error('经度超出范围'))
        } else {
          callback()
        }
      }
      let validateLat = (rule, value, callback) => {
        let pattern = /^[1-9]\d{0,2}(\.\d{1,10})?$|^0(\.\d{1,10})?$/
        if (this.departmentInfo.level === departmentEnum.level.getValueByFiledName('B')) {
          if (value === null || value === '') {
            callback(new Error('部门级别为办公点时详细地址必填！'))
          }
        } else {
          if (value === null || value === '') {
            callback()
          }
        }
        let test = new RegExp(pattern)
        if (!test.test(value)) {
          callback(new Error('经纬度格式错误！'))
        }
        if (value !== null || value !== '') {
          if (this.latPrefix === 0) {
            callback(new Error('请选择南北纬'))
          }
        }
        if (value > 90 || value < 0) {
          callback(new Error('纬度超出范围'))
        } else {
          callback()
        }
      }
      let validateType = (rule, value, callback) => {
        if (this.departmentInfo.level === departmentEnum.level.getValueByFiledName('B')) {
          if (value === null || value === '') {
            callback(new Error('部门级别为办公点时部门类型必填！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      let validateFlag = (rule, value, callback) => {
        if (this.departmentInfo.level === departmentEnum.level.getValueByFiledName('B')) {
          if (value === null || value === '') {
            callback(new Error('部门级别为办公点时办公室标识必填！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        id: null,
        parentDepartmentId: null,
        type: null,
        codePrefix: null,
        lngPrefix: 0,
        latPrefix: 0,
        lng: null,
        lat: null,
        officePoint: false,
        levelList: departmentEnum.level.getEnumList(),
        typeList: departmentEnum.type.getEnumList(),
        city: {},
        cityList: [],
        loading: false,
        departmentInfo: {
          code: '',
          name: '',
          leaderId: null,
          leaderName: '',
          cityId: null,
          cityName: null,
          address: '',
          lng: null,
          lat: null,
          mobile: '',
          email: '',
          telephone: '',
          level: null,
          parentDepartmentId: null,
          parentDepartmentName: '',
          businessLine: [],
          supportBusinessLine: [],
          type: null,
          flag: null,
          createTime: null,
          createEmp: '',
          modifyTime: null,
          modifyEmp: '',
          remark: '',
          status: null
        },
        mapAddress: {
          lat: null,
          lng: null,
          address: null
        },
        mapVisible: false,
        leaderVisible: false,
        rules: {
          code: [
            {required: true, message: '请输入部门编号', trigger: 'blur'},
            {pattern: /^[a-zA-Z0-9]{6}$/, message: '请输入6位字符，支持数字和字母，不支持特殊符号'}
          ],
          name: [
            {required: true, message: '请输入部门名称', trigger: 'blur'},
            {min: 1, max: 40, message: '请输入1-40位字符'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号'}
          ],
          email: [
            {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式错误', trigger: 'blur'},
            {max: 30, message: '请输入1-30个字符', trigger: 'blur'}
          ],
          telephone: [
            {pattern: /^[0-9]{4}-[0-9]{7,8}$/, message: '请输入4位区号-7至8位电话号'}
          ],
          cityId: [
            {required: true, message: '请选择所在城市', trigger: 'change'}
          ],
          address: [
            {validator: validateAddress, trigger: ['change', 'blur']}
          ],
          lng: [
            {validator: validateLng, trigger: 'change'},
          ],
          lat: [
            {validator: validateLat, trigger: 'change'},
          ],
          level: [
            {required: true, message: '请选择部门级别', trigger: 'change'}
          ],
          businessLine: [
            {type: 'array', required: true, message: '请至少选择一条业务线', trigger: 'change'}
          ],
          type: [
            {validator: validateType, trigger: 'blur'}
          ],
          flag: [
            {validator: validateFlag, trigger: 'blur'},
            {pattern: /^[0-9]{0,3}$/, message: '办公点标识格式错误'}
          ],
          remark: [
            {max: 200, message: '备注长度不要超过200字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      getDepartmentCode() {
        return this.departmentInfo.code
      },
      getLevel() {
        return this.departmentInfo.level
      },
      getDepartmentStatus() {
        return departmentEnum.status.getLabelByValue(this.departmentInfo.status)
      },
      getLng() {
        return this.departmentInfo.lng
      },
      getLat() {
        return this.departmentInfo.lat
      }
    },
    watch: {
      getDepartmentCode(val) {

      },
      getLevel(val) {
        let value = departmentEnum.level.getFieldByValue(val)
        if (this.codePrefix !== value) {
          this.codePrefix = value
          Message({
            message: '部门级别与部门编号关联，已自动变更部门编号',
            type: 'warning'
          })
        }
        if (val === departmentEnum.level.getValueByFiledName('B')) {
          this.officePoint = true
        } else {
          this.officePoint = false
          this.departmentInfo.type = null
          this.departmentInfo.flag = null
        }
      },
      'codePrefix': {
        handler: function () {
          let value = departmentEnum.level.getValueByFiledName(this.codePrefix)
          if (this.departmentInfo.level !== value) {
            this.departmentInfo.level = value
            Message({
              message: '部门编号与部门级别关联，已自动变更部门级别',
              type: 'warning'
            })
          }
        }
      },
      'levelList': {
        handler: function () {
          console.log(this.levelList)
        }
      },
      'city': {
        handler: function () {
          this.departmentInfo.cityId = this.city
        }
      },
      'lngPrefix': {
        handler: function () {
          this.lng = this.lngPrefix === 0 ? null : this.departmentInfo.lng * this.lngPrefix
          console.log("lng:", this.lng)
        }
      },
      'latPrefix': {
        handler: function () {
          this.lat = this.latPrefix === 0 ? null : this.departmentInfo.lat * this.latPrefix
          console.log("lat:", this.lat)
        }
      },
      getLng(val) {
        this.lng = this.lngPrefix * this.departmentInfo.lng
        console.log("lng:", this.lng)
      },
      getLat(val) {
        this.lat = this.latPrefix * this.departmentInfo.lat
        console.log("lat:", this.lat)
      }
    },
    created() {
      this.getParams()
      this.getDepartmentInfo()
    },
    methods: {
      getParams() {
        // 将数据放在当前组件的数据内
        this.parentDepartmentId = this.$route.query.departmentId;
        if (this.parentDepartmentId == null) {
          this.id = this.$route.params.id
          if (this.id != null) {
            //修改部门信息
            document.title = "修改部门信息"
            this.type = 1
          } else {
            Message({
              message: '跳转失败，请从父页面进入！',
              type: 'error',
              duration: 5 * 1000
            })
          }
        } else {
          //新建子部门
          document.title = "新建子部门"
          this.departmentInfo.parentDepartmentId = this.parentDepartmentId
          this.type = 0
        }
      },
      getDepartmentInfo() {
        if (this.type === 1) {
          if (null !== this.id) {
            getDepartmentInfo({id: this.id}).then((res) => {
              this.departmentInfo = res.data
              let code = res.data.code
              this.codePrefix = code.substring(0, 1)
              this.departmentInfo.code = code.substring(1, 7)
              if (res.data.lng !== null || res.data.lat !== null) {
                let lng = res.data.lng
                let lat = res.data.lat
                this.lngPrefix = lng >= 0 ? 1 : -1
                this.departmentInfo.lng = lng >= 0 ? lng : -1 * lng
                this.latPrefix = lat >= 0 ? 1 : -1
                this.departmentInfo.lat = lat >= 0 ? lat : -1 * lat
              }
              if (this.departmentInfo.level === departmentEnum.level.getValueByFiledName('B')) {
                this.officePoint = true
              }
              let businessLine = this.departmentInfo.businessLine
              if (null !== businessLine) {
                let business = []
                for (let i = 0; i < businessLine.length; i++) {
                  business.push(businessLine[i].id)
                }
                this.departmentInfo.businessLine = business
              }
              if (null !== res.data.createEmpName) {
                this.departmentInfo.createEmpName = res.data.createAccountNo + "(" + res.data.createEmpName + ")"
              } else {
                this.departmentInfo.createEmpName = res.data.createAccountNo
              }
              if (null !== res.data.modifyEmpName) {
                this.departmentInfo.modifyEmpName = res.data.modifyAccountNo + "(" + res.data.modifyEmpName + ")"
              } else {
                this.departmentInfo.modifyEmpName = res.data.modifyAccountNo
              }
            })
          }
        } else if (this.type === 0) {
          getDepartmentInfo({id: this.parentDepartmentId}).then((res) => {
            this.departmentInfo.parentDepartmentName = res.data.name
            this.departmentInfo.parentDepartmentId = res.data.id
            this.departmentInfo.supportBusinessLine = res.data.businessLine
            this.departmentInfo.status = departmentEnum.status.getValueByFiledName("enable")
          })
        }
        queryCity({cnName: ''}).then((res) => {
          this.cityList = res.data
        })
      },
      getCityList(query) {
        this.loading = true
        queryCity({cnName: query}).then((res) => {
          this.loading = false
          this.cityList = res.data
        })
      },
      commit(formName) {
        if ((this.lngPrefix !== 0 && this.departmentInfo.lng === null) || (this.latPrefix !== 0 && this.departmentInfo.lat === null)) {
          Message({
            message: '请完善经纬度！',
            type: 'error'
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let params = {
                name: this.departmentInfo.name,
                leaderId: this.departmentInfo.leaderId,
                leaderName: this.departmentInfo.leaderName,
                cityId: this.departmentInfo.cityId,
                address: this.departmentInfo.address,
                lng: this.lng,
                lat: this.lat,
                mobile: this.departmentInfo.mobile,
                email: this.departmentInfo.email,
                telephone: this.departmentInfo.telephone,
                businessLine: this.departmentInfo.businessLine,
                type: this.departmentInfo.type,
                flag: this.departmentInfo.flag,
                remark: this.departmentInfo.remark,
              }
              //新建子部门
              if (this.type === 0) {
                params.code = this.codePrefix + this.departmentInfo.code
                params.level = this.departmentInfo.level
                params.parentDepartmentId = this.departmentInfo.parentDepartmentId
                params.status = departmentEnum.status.getValueByFiledName("enable")
                addDepartment(params).then((res) => {
                  this.closeWindow(res, "新建成功")
                })
              } else if (this.type === 1) {
                //修改部门信息
                params.id = this.id
                params.parentDepartmentId = this.departmentInfo.parentDepartmentId
                params.level = this.departmentInfo.level
                updateDepartment(params).then((res) => {
                  this.closeWindow(res, "修改成功")
                })
              }
            } else {
              Message({
                message: '请完善相关信息！',
                type: 'error'
              })
            }
          })
        }
      },
      closeWindow(res, message) {
        if (res.data) {
          Message({
            message: message,
            type: 'success',
            duration: 1.5 * 1000
          })
        }
        setTimeout(() => {
          window.close()
        }, 1000)
      },
      cancel() {
        window.close()
      },
      openMap() {
        this.mapVisible = true
      },
      getAddress(val) {
        if (null !== val) {
          this.mapAddress.lat = val.position.lat
          this.latPrefix = val.position.lat >= 0 ? 1 : -1
          this.mapAddress.lng = val.position.lng
          this.lngPrefix = val.position.lng >= 0 ? 1 : -1
          this.mapAddress.address = val.address
        }
      },
      confirmAddress() {
        this.departmentInfo.lat = this.mapAddress.lat
        this.departmentInfo.lng = this.mapAddress.lng
        this.departmentInfo.address = this.mapAddress.address
        this.mapVisible = false
      },
      chooseLeader() {
        this.leaderVisible = true
      },
      selectStaff(val) {
        this.departmentInfo.leaderId = val.staffNumber
        this.departmentInfo.leaderName = val.staffName
      },
      changeLeaderVisible(val) {
        this.leaderVisible = val
      }
    }
  }
</script>

<style lang="scss">

  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: black;
    cursor: text;
  }

  .module {
    margin: 10px;
  }

  .row-title {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px
  }

  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }

</style>

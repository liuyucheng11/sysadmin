import {Enum} from '../../utils/Enum'

export default {

  /*level: new Enum().add('Z','总部',0).add('F','分公司',1).add('G','管理部',2).add('Q','区域',3).add('B','办公点',4),

  */
  corporateNature: new Enum().add('1', '一般纳税人', 0).add('2', '小规模纳税人', 1),
  status: new Enum().add('disable', '无效', 1).add('enable', '有效', 0),
  headOfficeFlag:new Enum().add('is','总公司',0).add('no','子公司',1),
  companyType:new Enum().add('1','有限责任公司',0).add('2','股份有限公司',1),
}

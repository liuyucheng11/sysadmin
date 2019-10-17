import { Enum } from '../../utils/Enum'

export default {

  level: new Enum().add('Z','总部',0).add('F','分公司',1).add('G','管理部',2).add('Q','区域',3).add('B','办公点',4),

  status: new Enum().add('disable','无效',0).add('enable','有效',1),

  type: new Enum().add('stores','门店',0).add('parking','停车场',1).add('delivery','交车中心',2).add('repair','维修厂',3)
}

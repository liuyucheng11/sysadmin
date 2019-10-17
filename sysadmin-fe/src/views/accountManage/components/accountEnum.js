import { Enum } from '../../../utils/Enum'

export default {
  dataLimit: new Enum().add('全选', '全选').add('全部', '全部', 1).add('递归', '递归', 2).add('本部门', '本部门', 3).add('本人', '本人', 4).add('手动选择', '手动选择', 5),
  status: new Enum().add('disable','正常',1).add('enable','冻结',2).add('delete','无效',3),
  modifyType: new Enum().add('1','新建',1).add('2','修改',2).add('3','删除',3).add('4','冻结',4).add('5','解冻',5).add('6','密码重置',6).add('7','分配角色权限',7).add('8','分配菜单权限',8).add('9','员工离职',9).add('10','员工删除',10)
}

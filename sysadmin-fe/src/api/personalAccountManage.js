import request from '@/utils/request'
export function getStaffInfoByUserName() {
  return request({
    url:'/PersonalAccountManage/getStaffDepartInfo.do',
   // data:accountNo,
    method:'post',
    headers:{
      'Content-Type':'application/json'
    },
    error(msg){
      console.log(msg)
    },
  })
}
export function modifyPassword(modifyPassword){
	return request({
		url:'/PersonalAccountManage/modifyPassword.do',
		method:'post',
		data:modifyPassword,
		headers:{
			'Content-Type':'application/json'
		},
		error(msg){
			console.log(msg);
		}
	})
}


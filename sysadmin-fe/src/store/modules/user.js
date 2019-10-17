import {login, logout, getInfo, getNowLoginInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  nowLogin: {},
	firstLogin:'',
	more60d:'',
  roleNames:[]
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_lOGIN: (state, roles) => {
    state.nowLogin = roles
  },
	SET_FIRST_lOGIN: (state, flag) => {
	  state.firstLogin = flag
	},
	SET_MORE60D:(state,flag)=>{
		state.more60d=flag
	},
    SET_ROLE_NAMES:(state,flag)=>{
      state.roleNames = flag
    }
	}


const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      let param = {username: username.trim(), password: password.trim()};
      login(JSON.stringify(param)).then(response => {
       if(response.data.firstLogin=="firstLogin")
			 {
         commit('SET_FIRST_lOGIN',response.data.firstLogin);
			 }
			 else{
				 commit('SET_FIRST_lOGIN',null);
			 }
			 if(response.data.more60d=='more60d')
			 {
				 commit('SET_MORE60D',response.data.more60d);
			 }else{
				 commit('SET_MORE60D',null);
			 }
				const data = response.data.uuid;
        commit('SET_TOKEN', data)
        setToken(data);
        commit('SET_lOGIN', response.data.user);
        resolve()
      }).catch(error => {
        //		alert("===1231")
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        console.log(response.data)
        const data = response.data

        if (!data) {
          console.log('data不存在', data)
          reject('Verification failed, please Login again.')
        }

        const {roles, username, avatar, introduction,roleNames} = data
         console.log(roleNames)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_ROLE_NAMES',roleNames)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
      // commit('SET_ROLES', ['admin'])
      // resolve({ roles: ['admin'] })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_lOGIN',{})
        var storage = window.localStorage;
        storage.clear();
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({commit, dispatch}, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {roles} = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  },

  //获取当前登录人
  getNowLogin({commit, state}) {
    return new Promise((resolve, reject) => {
      getNowLoginInfo().then(re=>{
        commit('SET_lOGIN', re.data);
        localStorage.setItem('nowLoginUser', JSON.stringify(re.data));
        resolve()
      }).catch(reject())
    })
  }
};


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

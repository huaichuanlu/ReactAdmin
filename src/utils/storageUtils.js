/*
进行local数据存储的管理工具
*/
import store from 'store'
const USER_KEY = 'user_key'
const StoreLocal = {
    //保存用户信息
    saveUser(user) {
        //localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },
    //读取用户信息
    getUser() {
        //返回一个JSONObject
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY || {})
    },
    //删除用户信息
    removeUser() {
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
export default StoreLocal
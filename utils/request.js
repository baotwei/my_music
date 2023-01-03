// 发送ajax请求
/*
 * 1. 封装功能函数
 *   1. 功能点明确
 *   2. 函数内部应该保留固定代码(静态的)
 *   3. 将动态的数据抽取成形参，由使用者根据自身的情况动态的传入实参
 *   4. 一个良好的功能函数应该设置形参的默认值(ES6的形参默认值)
 * 2. 封装功能组件
 *   1. 功能点明确
 *   2. 组件内部保留静态的代码
 *   3. 将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
 *   4. 一个良好的组件应该设置组件的必要性及数据类型
 *     props: {
 *       msg: {
 *         required: true,
 *         default: 默认值，
 *         type: String
 *       }
 *     }
 *
 * */
const baseUrl = "http://localhost:3000"; //公共路径
const host = "http://xicx5n.natappfree.cc";

export function request(url, data = {}, method) {
  // //设置请求头
  // var header = {
  //   'content-type': 'application/json',
  // };
  // //检查缓存中有没有token
  // var token = wx.getStorageSync('token');
  // if (token != '') {
  //   header = {
  //     'content-type': 'application/json',
  //     'Authorization': 'Bearer ' + token
  //   };
  // }
  let promise = new Promise(function(resolve, reject) {
    uni.request({
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf(
          'MUSIC_U') !== -1) : ''
      },
      url: baseUrl + url, //请求地址
      data,
      method: method, //请求方式
      success: (res) => {
        if (data.isLogin) {
          // 登录请求
          // 将用户的cookie存入至本地
          uni.setStorage({
            key: 'cookies',
            data: res.cookies
          });
        }
        resolve(res)
        // console.log(res)
      },
      fail: (res) => {
        reject(res)
        console.log(res)
      }
    })
  })
  return promise
}

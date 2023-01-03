"use strict";
const common_vendor = require("../common/vendor.js");
const baseUrl = "http://localhost:3000";
function request(url, data = {}, method) {
  let promise = new Promise(function(resolve, reject) {
    common_vendor.index.request({
      header: {
        cookie: wx.getStorageSync("cookies") ? wx.getStorageSync("cookies").find((item) => item.indexOf(
          "MUSIC_U"
        ) !== -1) : ""
      },
      url: baseUrl + url,
      data,
      method,
      success: (res) => {
        if (data.isLogin) {
          common_vendor.index.setStorage({
            key: "cookies",
            data: res.cookies
          });
        }
        resolve(res);
      },
      fail: (res) => {
        reject(res);
        console.log(res);
      }
    });
  });
  return promise;
}
exports.request = request;

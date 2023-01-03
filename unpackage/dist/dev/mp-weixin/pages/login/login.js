"use strict";
const utils_request = require("../../utils/request.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    async login() {
      let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (!this.phone) {
        wx.showToast({
          title: "\u624B\u673A\u53F7\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "none"
        });
        return;
      } else if (!phoneReg.test(this.phone)) {
        wx.showToast({
          title: "\u624B\u673A\u53F7\u683C\u5F0F\u9519\u8BEF",
          icon: "none"
        });
        return;
      }
      if (!this.password) {
        wx.showToast({
          title: "\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "none"
        });
        return;
      }
      console.log("\u8981\u5F00\u59CB\u767B\u9646\u4E86" + this.phone + "999" + this.password);
      let result = await utils_request.request("/login/cellphone", {
        phone: this.phone,
        password: this.password,
        isLogin: true
      });
      console.log("result.code", result);
      if (result.data.code === 200) {
        wx.showToast({
          title: "\u767B\u5F55\u6210\u529F",
          icon: "success",
          duration: 2e3
        });
        console.log("result.profile", result.data.profile);
        wx.setStorageSync("userInfo", JSON.stringify(result.data.profile));
        wx.reLaunch({
          url: "/pages/personal/personal"
        });
      } else if (result.data.code === 400) {
        wx.showToast({
          title: "\u624B\u673A\u53F7\u9519\u8BEF",
          icon: "none"
        });
      } else if (result.data.code === 502) {
        wx.showToast({
          title: "\u5BC6\u7801\u9519\u8BEF",
          icon: "none"
        });
      } else {
        wx.showToast({
          title: "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.phone,
    b: common_vendor.o(($event) => $data.phone = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.login && $options.login(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);

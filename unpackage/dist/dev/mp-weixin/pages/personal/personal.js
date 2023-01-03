"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
let startY = 0;
let moveY = 0;
let moveDistance = 0;
const _sfc_main = {
  data() {
    return {
      coverTransform: "translateY(0rpx)",
      coveTransition: "",
      userInfo: {},
      recentPlayList: []
    };
  },
  onLoad: function(options) {
    let userInfo = common_vendor.index.getStorageSync("userInfo");
    console.log("userInfo", userInfo);
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
      this.getUserRecentPlayList(this.userInfo.userId);
    }
  },
  methods: {
    async getUserRecentPlayList(userId) {
      let recentPlayListData = await utils_request.request("/user/record", {
        uid: userId,
        type: 0
      });
      console.log("recentPlayListData", recentPlayListData);
      let index = 0;
      let recentPlayList = recentPlayListData.data.allData.splice(0, 10).map((item) => {
        item.id = index++;
        return item;
      });
      this.recentPlayList = recentPlayList;
    },
    handleTouchStart(event) {
      this.coveTransition = "";
      startY = event.touches[0].clientY;
    },
    handleTouchMove(event) {
      moveY = event.touches[0].clientY;
      moveDistance = moveY - startY;
      if (moveDistance <= 0) {
        return;
      }
      if (moveDistance >= 80) {
        moveDistance = 80;
      }
      this.coverTransform = "translateY(" + moveDistance + "rpx)";
    },
    handleTouchEnd() {
      this.coverTransform = "translateY(0rpx)", this.coveTransition = "transform 1s linear";
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatarUrl ? $data.userInfo.avatarUrl : "/static/images/personal/missing-face.png",
    b: common_vendor.t($data.userInfo.nickname ? $data.userInfo.nickname : "\u6E38\u5BA2"),
    c: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args)),
    d: $data.recentPlayList.length
  }, $data.recentPlayList.length ? {
    e: common_vendor.f($data.recentPlayList, (item, index, i0) => {
      return {
        a: item.song.al.picUrl,
        b: index
      };
    })
  } : {}, {
    f: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    g: common_vendor.o((...args) => $options.handleTouchMove && $options.handleTouchMove(...args)),
    h: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
    i: $data.coverTransform,
    j: $data.coveTransition
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/personal/personal.vue"]]);
wx.createPage(MiniProgramPage);

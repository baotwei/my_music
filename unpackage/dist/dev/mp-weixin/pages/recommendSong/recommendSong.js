"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      day: "",
      month: "",
      recommendList: [],
      index: 0
    };
  },
  onLoad: function(options) {
    let userInfo = common_vendor.index.getStorageSync("userInfo");
    if (!userInfo) {
      common_vendor.index.showToast({
        title: "\u8BF7\u5148\u767B\u5F55",
        icon: "none",
        success: () => {
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }
      });
    }
    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.getRecommendList();
    PubSub.subscribe("switchType", (msg, type) => {
      let {
        recommendList,
        index
      } = this;
      if (type === "pre") {
        if (index === 0) {
          index = recommendList.length;
        }
        index -= 1;
      } else {
        if (index === recommendList.length - 1) {
          index = -1;
        }
        index += 1;
      }
      this.index = index;
      let musicId = recommendList[index].id;
      PubSub.publish("musicId", musicId);
    });
  },
  methods: {
    async getRecommendList() {
      let recommendListData = await utils_request.request("/recommend/songs");
      this.recommendList = recommendListData.data.data.dailySongs;
      console.log("this.recommendList", this.recommendList);
    },
    toSongDetail(event) {
      let {
        song,
        index
      } = event.currentTarget.dataset;
      this.index = index;
      wx.navigateTo({
        url: "/pages/songDetail/songDetail?musicId=" + song.id
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.day),
    b: common_vendor.t($data.month),
    c: common_vendor.f($data.recommendList, (item, index, i0) => {
      return {
        a: item.al.picUrl,
        b: common_vendor.t(item.al.name),
        c: common_vendor.t(item.ar[0].name),
        d: common_vendor.o((...args) => $options.toSongDetail && $options.toSongDetail(...args), item.id),
        e: item.id,
        f: index,
        g: item
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/recommendSong/recommendSong.vue"]]);
wx.createPage(MiniProgramPage);

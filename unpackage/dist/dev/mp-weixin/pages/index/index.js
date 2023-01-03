"use strict";
const utils_request = require("../../utils/request.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      title: "Hello",
      background: ["color1", "color2", "color3"],
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      bannerList: [],
      recommendList: [],
      topList: [],
      index: 0
    };
  },
  onLoad: async function(options) {
    let bannerListData = await utils_request.request(
      "/banner",
      {
        type: 2
      },
      "get"
    );
    this.bannerList = bannerListData.data.banners;
    console.log("bannerList", bannerListData.data.banners);
    let recommendListData = await utils_request.request("/personalized", {
      limit: 10
    }, "get");
    this.recommendList = recommendListData.data.result;
    console.log("recommendList", recommendListData.data.result);
    let index = 0;
    while (index < 5) {
      let topListData = await utils_request.request("/toplist", {
        id: index++
      }, "get");
      console.log("topListData", topListData);
      let topListSongData = await utils_request.request("/playlist/track/all", {
        id: topListData.data.list[index].id,
        limit: 10,
        offset: 1
      }, "get");
      let topListItem = {
        name: topListData.data.list[index].name,
        songInfo: topListSongData.data.songs.slice(0, 3)
      };
      console.log("topListSongData", topListSongData);
      this.topList.push(topListItem);
      console.log("topList", this.topList);
    }
  },
  methods: {
    toRecommendSong() {
      wx.navigateTo({
        url: "/pages/recommendSong/recommendSong"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, k0, i0) => {
      return {
        a: item.pic,
        b: item.bannerId
      };
    }),
    b: $data.indicatorDots,
    c: $data.autoplay,
    d: $data.interval,
    e: $data.duration,
    f: common_vendor.o((...args) => $options.toRecommendSong && $options.toRecommendSong(...args)),
    g: common_vendor.f($data.recommendList, (recommendListItem, k0, i0) => {
      return {
        a: recommendListItem.picUrl,
        b: common_vendor.t(recommendListItem.name),
        c: recommendListItem.id
      };
    }),
    h: common_vendor.f($data.topList, (topListItem, index, i0) => {
      return {
        a: common_vendor.t(topListItem.name),
        b: common_vendor.f(topListItem.songInfo, (topListItemSongInfo, index2, i1) => {
          return {
            a: topListItemSongInfo.al.picUrl,
            b: common_vendor.t(index2 + 1),
            c: common_vendor.t(topListItemSongInfo.al.name),
            d: index2
          };
        }),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      videoGroupList: [],
      navId: "",
      videoList: [],
      videoId: "",
      videoUpdateTime: [],
      isTriggered: false,
      offsetId: 0,
      videoUrlList: [],
      videLists: []
    };
  },
  onLoad: function(options) {
    this.getVideoGroupListData();
  },
  methods: {
    async getVideoGroupListData() {
      let videoGroupListData = await utils_request.request("/video/group/list");
      this.videoGroupList = videoGroupListData.data.data.slice(0, 14);
      this.navId = videoGroupListData.data.data[0].id;
      console.log("videoGroupListData", videoGroupListData);
      this.getVideoList(this.navId);
    },
    async getVideoList(navId) {
      if (!navId) {
        return;
      }
      this.offsetId = 0;
      let videoListData = await utils_request.request("/video/group", {
        id: navId,
        offset: this.offsetId
      });
      console.log("videoListData", videoListData);
      wx.hideLoading();
      let index = 0;
      let videoList = videoListData.data.datas.map((item) => {
        item.id = index++;
        return item;
      });
      this.videoList = videoList;
      console.log("videoList---", this.videoList);
      let videoUrlId = videoList.map((item) => {
        return item.data.vid;
      });
      console.log("videoUrlId", videoUrlId);
      let videoUrlIndex = 0;
      while (videoUrlIndex < videoUrlId.length) {
        let videoUrl = await utils_request.request("/video/url", {
          id: videoUrlId[videoUrlIndex++]
        });
        this.videoUrlList.push(videoUrl);
      }
      this.isTriggered = false;
    },
    changeNav(event) {
      console.log("event", event);
      let navId = event.currentTarget.dataset.id;
      console.log("navId", navId);
      this.navId = navId >>> 0;
      this.videoList = [];
      wx.showLoading({
        title: "\u6B63\u5728\u52A0\u8F7D"
      });
      this.getVideoList(this.navId);
    },
    handlePlay(event) {
      let vid = event.currentTarget.id;
      this.videoId = vid;
      this.videoContext = common_vendor.index.createVideoContext(vid);
      console.log("videoUpdateTime", this);
      let {
        videoUpdateTime
      } = this;
      let videoItem = videoUpdateTime.find((item) => item.vid === vid);
      if (videoItem) {
        this.videoContext.seek(videoItem.currentTime);
      }
      this.videoContext.play();
    },
    handleTimeUpdate(event) {
      let videoTimeObj = {
        vid: event.currentTarget.id,
        currentTime: event.detail.currentTime
      };
      let {
        videoUpdateTime
      } = this;
      let videoItem = videoUpdateTime.find((item) => item.vid === videoTimeObj.vid);
      if (videoItem) {
        videoItem.currentTime = event.detail.currentTime;
      } else {
        videoUpdateTime.push(videoTimeObj);
      }
      this.videoUpdateTime = videoUpdateTime;
    },
    handleEnded(event) {
      let {
        videoUpdateTime
      } = this;
      videoUpdateTime.splice(videoUpdateTime.findIndex((item) => item.vid === event.currentTarget.id), 1);
      this.videoUpdateTime = videoUpdateTime;
    },
    handleRefresher() {
      console.log("scroll-view \u4E0B\u62C9\u5237\u65B0");
      this.getVideoList(this.navId);
    },
    async handleToLower() {
      console.log("scroll-view \u4E0A\u62C9\u89E6\u5E95");
      console.log("\u53D1\u9001\u8BF7\u6C42 || \u5728\u524D\u7AEF\u622A\u53D6\u6700\u65B0\u7684\u6570\u636E \u8FFD\u52A0\u5230\u89C6\u9891\u5217\u8868\u7684\u540E\u65B9");
      console.log("\u7F51\u6613\u4E91\u97F3\u4E50\u6682\u65F6\u6CA1\u6709\u63D0\u4F9B\u5206\u9875\u7684api");
      let newVideoListData = await utils_request.request("/video/group", {
        id: this.navId,
        offset: ++this.offsetId
      });
      console.log("newVideoList", newVideoList);
      console.log("videoList", this.videoList);
      let videoList = this.videoList;
      let index = 0;
      let newVideoList = newVideoListData.data.datas.map((item) => {
        item.id = index++;
        return item;
      });
      videoList.push(...newVideoList);
      console.log("videoList---", videoList);
      this.videoList = videoList;
      let videoUrlId = videoList.map((item) => {
        return item.data.vid;
      });
      console.log("videoUrlId", videoUrlId);
      let videoUrlIndex = 0;
      while (videoUrlIndex < videoUrlId.length) {
        let videoUrl = await utils_request.request("/video/url", {
          id: videoUrlId[videoUrlIndex++]
        });
        this.videoUrlList.push(videoUrl);
      }
    },
    toSearch() {
      wx.navigateTo({
        url: "/pages/search/search"
      });
    }
  },
  onPullDownRefresh() {
    console.log("\u9875\u9762\u7684\u4E0B\u62C9\u5237\u65B0");
  },
  onReachBottom: function() {
    console.log("\u9875\u9762\u7684\u4E0A\u62C9\u89E6\u5E95");
  },
  onShareAppMessage: function({
    from
  }) {
    console.log(from);
    if (from === "button") {
      return {
        title: "\u6765\u81EAbutton\u7684\u8F6C\u53D1",
        page: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg"
      };
    } else {
      return {
        title: "\u6765\u81EAmenu\u7684\u8F6C\u53D1",
        page: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg"
      };
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.toSearch && $options.toSearch(...args)),
    b: common_vendor.f($data.videoGroupList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.n("navContent " + ($data.navId === item.id ? "active" : "")),
        c: common_vendor.o((...args) => $options.changeNav && $options.changeNav(...args), item.id),
        d: item.id,
        e: item.id,
        f: "scroll" + item.id,
        g: item.id
      };
    }),
    c: "scroll" + $data.navId,
    d: common_vendor.f($data.videoList, (item, index, i0) => {
      return common_vendor.e({
        a: $data.videoId === item.data.vid
      }, $data.videoId === item.data.vid ? {
        b: $data.videoUrlList[index].data.urls[0].url,
        c: common_vendor.o((...args) => $options.handlePlay && $options.handlePlay(...args), index),
        d: item.data.vid,
        e: item.data.coverUrl,
        f: common_vendor.o((...args) => $options.handleTimeUpdate && $options.handleTimeUpdate(...args), index),
        g: common_vendor.o((...args) => $options.handleEnded && $options.handleEnded(...args), index)
      } : {
        h: common_vendor.o((...args) => $options.handlePlay && $options.handlePlay(...args), index),
        i: item.data.vid,
        j: item.data.coverUrl
      }, {
        k: common_vendor.t(item.data.title),
        l: item.data.creator.avatarUrl,
        m: common_vendor.t(item.data.creator.nickname),
        n: common_vendor.t(item.data.praisedCount),
        o: common_vendor.t(item.data.commentCount),
        p: index
      });
    }),
    e: common_vendor.o((...args) => $options.handleRefresher && $options.handleRefresher(...args)),
    f: $data.isTriggered,
    g: common_vendor.o((...args) => $options.handleToLower && $options.handleToLower(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/video/video.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);

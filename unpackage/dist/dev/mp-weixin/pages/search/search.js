"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
let isSend = false;
const _sfc_main = {
  data() {
    return {
      placeholderContent: "",
      hotList: [],
      searchContent: "",
      searchList: [],
      historyList: []
    };
  },
  onLoad: function(options) {
    this.getInitData();
    this.getSearchHistory();
  },
  onReady: function() {
  },
  onShow: function() {
  },
  onHide: function() {
  },
  onUnload: function() {
  },
  onPullDownRefresh: function() {
  },
  onReachBottom: function() {
  },
  onShareAppMessage: function() {
  },
  methods: {
    async getInitData() {
      let placeholderData = await utils_request.request("/search/default");
      let hotListData = await utils_request.request("/search/hot/detail");
      this.placeholderContent = placeholderData.data.showKeyword;
      this.hotList = hotListData.data;
    },
    getSearchHistory() {
      let historyList = common_vendor.index.getStorageSync("searchHistory");
      if (historyList) {
        this.historyList = historyList;
      }
    },
    handleInputChange(event) {
      this.searchContent = event.detail.value.trim();
      if (isSend) {
        return;
      }
      isSend = true;
      this.getSearchList();
      setTimeout(() => {
        isSend = false;
      }, 300);
    },
    async getSearchList() {
      if (!this.searchContent) {
        this.searchList = [];
        return;
      }
      let {
        searchContent,
        historyList
      } = this;
      let searchListData = await utils_request.request("/search", {
        keywords: searchContent,
        limit: 10
      });
      this.searchList = searchListData.result.songs;
      if (historyList.indexOf(searchContent) !== -1) {
        historyList.splice(historyList.indexOf(searchContent), 1);
      }
      historyList.unshift(searchContent);
      this.historyList = historyList;
      common_vendor.index.setStorageSync("searchHistory", historyList);
    },
    clearSearchContent() {
      this.searchContent = "", this.searchList = [];
    },
    deleteSearchHistory() {
      common_vendor.index.showModal({
        content: "\u786E\u8BA4\u5220\u9664\u5417?",
        success: (res) => {
          if (res.confirm) {
            this.historyList = [];
            common_vendor.index.removeStorageSync("searchHistory");
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.searchContent,
    b: $data.placeholderContent,
    c: $options.handleInputChange,
    d: $data.searchContent
  }, $data.searchContent ? {
    e: common_vendor.o((...args) => $options.clearSearchContent && $options.clearSearchContent(...args))
  } : {}, {
    f: $data.searchList.length
  }, $data.searchList.length ? {
    g: common_vendor.t($data.searchContent),
    h: common_vendor.f($data.searchList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id
      };
    })
  } : common_vendor.e({
    i: $data.historyList.length
  }, $data.historyList.length ? {
    j: common_vendor.f($data.historyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    k: common_vendor.o((...args) => $options.deleteSearchHistory && $options.deleteSearchHistory(...args))
  } : {}, {
    l: common_vendor.f($data.hotList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.searchWord),
        c: item.iconUrl
      }, item.iconUrl ? {
        d: item.iconUrl
      } : {}, {
        e: item.searchWord
      });
    })
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/search/search.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);

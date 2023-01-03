"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/video/video.js";
  "./pages/login/login.js";
  "./pages/personal/personal.js";
  "./pages/search/search.js";
  "./pages/recommendSong/recommendSong.js";
  "./pages/songDetail/songDetail.js";
}
const _sfc_main = {
  data() {
    return {};
  },
  globalData: {
    isMusicPlay: false,
    musicId: ""
  },
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/products/applet/applet-uni-app/my_music/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;

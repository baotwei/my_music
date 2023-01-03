"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const app = getApp();
const _sfc_main = {
  data() {
    return {
      isPlay: false,
      song: {
        ar: "",
        al: {
          picUrl: ""
        }
      },
      musicId: "",
      musicLink: "",
      currentTime: "00:00",
      durationTime: "00:00",
      currentWidth: 0,
      name: ""
    };
  },
  onLoad(options) {
    let musicId = options.musicId;
    this.musicId = musicId;
    this.getMusicInfo(musicId);
    if (app.globalData.isMusicPlay && app.globalData.musicId === musicId) {
      this.isPlay = true;
    } else {
      this.currentWidth = 0;
      this.currentTime = "00:00";
    }
    this.backgroundAudioManager = common_vendor.index.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      app.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onEnded(() => {
      common_vendor.PubSub.publish("switchType", "next");
      this.currentWidth = 0;
      this.currentTime = "00:00";
    });
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = common_vendor.hooks(this.backgroundAudioManager.currentTime * 1e3).format("mm:ss");
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      if (app.globalData.musicId !== musicId) {
        this.currentWidth = 0;
        this.currentTime = "00:00";
      } else {
        this.currentTime = currentTime;
        this.currentWidth = currentWidth;
      }
    });
  },
  methods: {
    changePlayState(isPlay) {
      this.isPlay = isPlay;
      app.globalData.isMusicPlay = isPlay;
    },
    async getMusicInfo(musicId) {
      console.log("musicId", musicId);
      let songData = await utils_request.request("/song/detail", {
        ids: musicId
      });
      let durationTime = common_vendor.hooks(songData.data.songs[0].dt).format("mm:ss");
      this.song = songData.data.songs[0];
      console.log("songData", this.song);
      this.durationTime = durationTime;
      common_vendor.index.setNavigationBarTitle({
        title: this.song.name
      });
    },
    handleMusicPlay() {
      let isPlay = !this.isPlay;
      let {
        musicId,
        musicLink
      } = this;
      this.musicControl(isPlay, musicId, musicLink);
    },
    async musicControl(isPlay, musicId, musicLink) {
      if (isPlay) {
        if (!musicLink) {
          let musicLinkData = await utils_request.request("/song/url", {
            id: musicId
          });
          console.log("musicLinkData", musicLinkData);
          musicLink = musicLinkData.data.data[0].url;
          this.musicLink = musicLink;
        }
        this.backgroundAudioManager.src = musicLink;
        this.backgroundAudioManager.title = this.song.name;
      } else {
        this.backgroundAudioManager.pause();
      }
    },
    handleSwitch(event) {
      let type = event.currentTarget.id;
      console.log(type);
      this.backgroundAudioManager.stop();
      common_vendor.PubSub.subscribe("musicId", (msg, musicId) => {
        this.getMusicInfo(musicId);
        this.musicControl(true, musicId);
        common_vendor.PubSub.unsubscribe("musicId");
      });
      common_vendor.PubSub.publish("switchType", type);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.song.ar[0].name),
    b: common_vendor.n("needle " + ($data.isPlay === false ? "" : "needleRotate")),
    c: $data.song.al.picUrl,
    d: common_vendor.n("discContainer " + ($data.isPlay && "discAnimation")),
    e: common_vendor.t($data.currentTime),
    f: common_vendor.s("width: " + ($data.currentWidth + "rpx")),
    g: common_vendor.t($data.durationTime),
    h: common_vendor.o((...args) => $options.handleSwitch && $options.handleSwitch(...args)),
    i: common_vendor.n("iconfont " + ($data.isPlay === true ? "icon-zanting" : "icon-bofang") + " big"),
    j: common_vendor.o((...args) => $options.handleMusicPlay && $options.handleMusicPlay(...args)),
    k: common_vendor.o((...args) => $options.handleSwitch && $options.handleSwitch(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/products/applet/applet-uni-app/my_music/pages/songDetail/songDetail.vue"]]);
wx.createPage(MiniProgramPage);

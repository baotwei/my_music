<template>
  <view class="songDetailContainer">
    <view class="author">{{ song.ar[0].name }}</view>
    <view class="circle"></view>
    <image :class="'needle '+ (isPlay===false?'':'needleRotate')" src="/static/images/song/needle.png"></image>
    <!-- <image class="needle " src="/static/images/song/needle.png"></image> -->
    <view :class="'discContainer ' + (isPlay && 'discAnimation')">
      <image class="disc" src="/static/images/song/disc.png"></image>
      <image class="musicImg" :src="song.al.picUrl"></image>
    </view>

    <!-- 进度条控制区域 -->
    <view class="progressControl">
      <text>{{ currentTime }}</text>
      <!-- 总进度条 -->
      <view class="barControl">
        <!-- 实时进度条 -->
        <view class="audio-currentTime-Bar" :style="'width: ' + (currentWidth + 'rpx')">
          <!-- 小圆球 -->
          <view class="audio-circle"></view>
        </view>
      </view>
      <text>{{ durationTime }}</text>
    </view>
    <!-- 底部控制播放区域 -->
    <view class="musicControl">
      <text class="iconfont icon-suijibofang"></text>
      <text class="iconfont icon-shangyishoushangyige" id="pre" @click="handleSwitch"></text>
      <text :class="'iconfont ' + (isPlay===true ? 'icon-zanting' : 'icon-bofang') + ' big'"
        @click="handleMusicPlay"></text>
      <text class="iconfont icon-xiayigexiayishou" id="next" @click="handleSwitch"></text>
      <text class="iconfont icon-liebiao"></text>
    </view>
  </view>
</template>

<script>
  import {
    request
  } from '/utils/request.js'
  import PubSub from 'pubsub-js';
  import moment from 'moment';
  const app = getApp();
  export default {
    data() {
      return {
        isPlay: false,
        // 音乐是否播放
        // 音乐是否播放
        song: {
          ar: '',
          al: {
            picUrl: ''
          }
        },
        // 歌曲详情对象
        musicId: '',
        // 音乐id
        musicLink: '',
        // 音乐的链接
        currentTime: '00:00',
        // 实时时间
        durationTime: '00:00',
        // 总时长
        // 实时进度条的宽度
        currentWidth: 0,
        name: ''
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */

    onLoad(options) {
      // options: 用于接收路由跳转的query参数
      // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
      // console.log(JSON.parse(options.songPackage));
      let musicId = options.musicId;
      this.musicId = musicId
      // 获取音乐详情
      this.getMusicInfo(musicId);
      /*
       * 问题： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
       * 解决方案：
       *   1. 通过控制音频的实例 backgroundAudioManager 去监视音乐播放/暂停
       *
       * */
      // 判断当前页面音乐是否在播放
      if (app.globalData.isMusicPlay && app.globalData.musicId === musicId) {
        // 修改当前页面音乐播放状态为true
        this.isPlay = true
      } else {
        this.currentWidth = 0;
        this.currentTime = '00:00'
      }

      // 创建控制音乐播放的实例
      this.backgroundAudioManager = uni.getBackgroundAudioManager(); // 监视音乐播放/暂停/停止

      this.backgroundAudioManager.onPlay(() => {
        this.changePlayState(true); // 修改全局音乐播放的状态
        app.globalData.musicId = musicId;
      });
      this.backgroundAudioManager.onPause(() => {
        this.changePlayState(false);
      });
      this.backgroundAudioManager.onStop(() => {
        this.changePlayState(false);
      });

      // 监听音乐播放自然结束
      this.backgroundAudioManager.onEnded(() => {
        // 自动切换至下一首音乐，并且自动播放
        PubSub.publish('switchType', 'next'); // 将实时进度条的长度还原成 0；时间还原成 0；
        this.currentWidth = 0;
        this.currentTime = '00:00'

      });

      // 监听音乐实时播放的进度
      this.backgroundAudioManager.onTimeUpdate(() => {
        // console.log('总时长: ', this.backgroundAudioManager.duration);
        // console.log('实时的时长: ', this.backgroundAudioManager.currentTime);
        // 格式化实时的播放时间
        let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
        let currentWidth = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 450;
        if (app.globalData.musicId !== musicId) {
          this.currentWidth = 0;
          this.currentTime = '00:00'
        } else {
          this.currentTime = currentTime;
          this.currentWidth = currentWidth;
        }


      });

    },

    methods: {
      // 修改播放状态的功能函数
      changePlayState(isPlay) {
        // 修改音乐是否的状态
        this.isPlay = isPlay;
        // 修改全局音乐播放的状态

        app.globalData.isMusicPlay = isPlay;
      },
      // 获取音乐详情的功能函数
      async getMusicInfo(musicId) {
        console.log("musicId", musicId)
        let songData = await request('/song/detail', {
          ids: musicId
        }); // songData.songs[0].dt 单位ms
        // console.log("songData", songData)
        let durationTime = moment(songData.data.songs[0].dt).format('mm:ss');
        this.song = songData.data.songs[0];
        // this.song.ar = songData.data.songs[0].ar;
        console.log("songData", this.song)
        this.durationTime = durationTime

        // 动态修改窗口标题
        uni.setNavigationBarTitle({
          title: this.song.name
        });
      },
      // 点击播放/暂停的回调
      handleMusicPlay() {
        let isPlay = !this.isPlay; // // 修改是否播放的状态
        // this.setData({
        //   isPlay
        // })

        let {
          musicId,
          musicLink
        } = this;
        this.musicControl(isPlay, musicId, musicLink);
      },
      // 控制音乐播放/暂停的功能函数
      async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
          // 音乐播放
          if (!musicLink) {
            // 获取音乐播放链接
            let musicLinkData = await request('/song/url', {
              id: musicId
            });
            console.log("musicLinkData", musicLinkData)
            musicLink = musicLinkData.data.data[0].url;
            this.musicLink = musicLink
          }
          this.backgroundAudioManager.src = musicLink;
          this.backgroundAudioManager.title = this.song.name;
        } else {
          // 暂停音乐
          this.backgroundAudioManager.pause();
        }
      },
      // 点击切歌的回调
      handleSwitch(event) {
        // 获取切歌的类型
        let type = event.currentTarget.id; // 关闭当前播放的音乐
        console.log(type);
        this.backgroundAudioManager.stop(); // // 订阅来自recommendSong页面发布的musicId消息

        PubSub.subscribe('musicId', (msg, musicId) => {
          // console.log(musicId);
          // 获取音乐详情信息
          this.getMusicInfo(musicId); // 自动播放当前的音乐

          this.musicControl(true, musicId); // 取消订阅

          PubSub.unsubscribe('musicId');
        }); // 发布消息数据给recommendSong页面
        PubSub.publish('switchType', type);
      }
    }

  }
</script>

<style>
  page {
    height: 100%;
  }

  .songDetailContainer {
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 底座 */
  .circle {
    position: relative;
    z-index: 100;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #fff;
    margin: 10rpx 0;
  }

  /* 摇杆 */
  .needle {
    position: relative;
    z-index: 99;
    top: -40rpx;
    left: 60rpx;
    width: 192rpx;
    height: 274rpx;
    transform-origin: 40rpx 0;
    transform: rotate(-20deg);
    transition: transform 1s;
  }

  .needleRotate {
    transform: rotate(0deg);
  }

  /* 磁盘 */
  .discContainer {
    position: relative;
    top: -170rpx;
    width: 598rpx;
    height: 598rpx;
  }

  .discAnimation {
    animation: disc 4s linear infinite;
    animation-delay: 1s;
  }

  /*
  @keyframes: 设置动画帧
    1) from to
      - 使用于简单的动画，只有起始帧和结束帧
      - 北京 - 上海  直达
    2) 百分比
      - 多用于复杂的动画，动画不止两帧
      - 北京 - 上海 ---> 北京 -- 天津 --- 深圳 --- 上海
      - 0% - 100%, 可以任意拆分

*/

  @keyframes disc {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .disc {
    width: 598rpx;
    height: 598rpx;
  }

  .musicImg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 370rpx;
    height: 370rpx;
    border-radius: 50%;
  }

  /* 底部控制区域 */
  .musicControl {
    position: absolute;
    bottom: 40rpx;
    left: 0;
    border-top: 1rpx solid #fff;
    width: 100%;
    display: flex;
  }

  .musicControl text {
    width: 20%;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    color: #fff;
    font-size: 50rpx;
  }

  .musicControl text.big {
    font-size: 80rpx;
  }

  /* 进度条控制区域 */
  .progressControl {
    position: absolute;
    bottom: 200rpx;
    width: 640rpx;
    height: 80rpx;
    line-height: 80rpx;
    display: flex;
  }

  .barControl {
    position: relative;
    width: 450rpx;
    height: 4rpx;
    background: rgba(0, 0, 0, 0.4);
    margin: auto;
  }

  .audio-currentTime-Bar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 4rpx;
    background: red;
  }

  /* 小圆球 */
  .audio-circle {
    position: absolute;
    right: -12rpx;
    top: -4rpx;
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #fff;
  }
</style>

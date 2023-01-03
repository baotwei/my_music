<template>
  <view class="recommendSongContainer">
    <!-- 头部  -->
    <view class="header">
      <image src="/static/images/recommendSong/recommendSong.jpg"></image>
      <view class="date">
        <text class="day">{{day}} /</text>
        <text class="month">{{month}}</text>
      </view>
    </view>

    <!-- 列表区域 -->
    <view class="ListContainer">
      <view class="listHeader">
        <text>播放全部</text>
        <text class="changeMore">多选</text>
      </view>

      <!-- 内容区 -->
      <scroll-view scroll-y class='listScroll'>
        <view class="scrollItem" @click="toSongDetail" v-for="(item, index) in recommendList" :key="item.id"
          :data-index="index" :data-song="item">

          <image :src="item.al.picUrl"></image>
          <view class="musicInfo">
            <text class="musicName">{{item.al.name}}</text>
            <text class="author">{{item.ar[0].name}}</text>
          </view>
          <text class="iconfont icon-gengduo"></text>
        </view>
      </scroll-view>
    </view>
  </view>

</template>

<script>
  import {
    request
  } from '/utils/request.js';

  export default {
    data() {
      return {
        day: '',
        // 天
        month: '',
        // 月
        recommendList: [],
        // 推荐列表数据
        index: 0 // 点击音乐的下标
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      // 判断用户是否登录
      let userInfo = uni.getStorageSync('userInfo');

      if (!userInfo) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          success: () => {
            // 跳转至登录界面
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }
        });
      } // 更新日期的状态数据

      this.day = new Date().getDate();
      this.month = new Date().getMonth() + 1 // 获取每日推荐的数据
      this.getRecommendList(); // 订阅来自songDetail页面发布的消息

      PubSub.subscribe('switchType', (msg, type) => {
        let {
          recommendList,
          index
        } = this;

        if (type === 'pre') {
          // 上一首
          if (index === 0) {
            index = recommendList.length;
          }

          index -= 1;
        } else {
          // 下一首
          if (index === recommendList.length - 1) {
            index = -1;
          }

          index += 1;
        } // 更新下标

        this.index = index

        let musicId = recommendList[index].id; // 将musicId回传给songDetail页面

        PubSub.publish('musicId', musicId);
      });
    },

    methods: {
      // 获取用户每日推荐数据
      async getRecommendList() {
        let recommendListData = await request('/recommend/songs');
        this.recommendList = recommendListData.data.data.dailySongs
        console.log("this.recommendList", this.recommendList)
      },

      // 跳转至songDetail页面
      toSongDetail(event) {
        let {
          song,
          index
        } = event.currentTarget.dataset;
        this.index = index

        // 路由跳转传参： query参数
        wx.navigateTo({
          // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
          // url: '/pages/songDetail/songDetail?songPackage=' + JSON.stringify(songPackage)
          // url: '/songPackage/pages/songDetail/songDetail?musicId=' + song.id
          url: '/pages/songDetail/songDetail?musicId=' + song.id
        })
      },
    }
  }
</script>

<style>
  page {
    height: 100%;
  }

  .recommendSongContainer .header {
    position: relative;
    width: 100%;
    height: 300rpx;
  }

  .recommendSongContainer .header image {
    width: 100%;
    height: 100%;
  }

  .recommendSongContainer .header .date {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -150rpx;
    margin-top: -50rpx;
    width: 300rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    color: #fff;
  }

  .header .date .day {
    font-size: 38rpx;
  }



  /* 列表区域 */
  .ListContainer {
    position: relative;
    top: -20rpx;
    padding: 0 20rpx;
    border-radius: 30rpx;
    background: #fff;
  }

  .listHeader {
    height: 80rpx;
    line-height: 80rpx;
  }

  .listHeader .changeMore {
    float: right;
  }


  /* 内容区 */
  .listScroll {
    height: calc(100vh - 380rpx);
  }

  .scrollItem {
    position: relative;
    display: flex;
    margin-bottom: 20rpx;
  }

  .scrollItem image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 8rpx;
  }

  .musicInfo {
    display: flex;
    flex-direction: column;
    margin-left: 20rpx;

  }

  .musicInfo text {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 24rpx;
    max-width: 500rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .scrollItem .iconfont {
    position: absolute;
    right: 0;
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: right;
  }
</style>

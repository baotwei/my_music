<template>
  <view class="uni-margin-wrap">
    <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
      :duration="duration">
      <swiper-item v-for="item in bannerList" :key="item.bannerId">
        <image :src="item.pic"></image>
      </swiper-item>
    </swiper>
  </view>

  <view class="navContainer">
    <view class="navItem" @click="toRecommendSong">
      <text class="iconfont icon-icon-"></text>
      <text>每日推荐</text>
    </view>
    <view class="navItem">
      <text class="iconfont icon-gedan"></text>
      <text>歌单</text>
    </view>
    <view class="navItem">
      <text class="iconfont icon-paixingbang"></text>
      <text>排行榜</text>
    </view>
    <view class="navItem">
      <text class="iconfont icon-diantai"></text>
      <text>电台</text>
    </view>
    <view class="navItem">
      <text class="iconfont icon-zhibo"></text>
      <text>直播</text>
    </view>
  </view>

  <!-- 推荐歌曲区域 -->
  <view class="recommendContainer">
    <!-- 头部区域 -->
    <view class="header">
      <view class="title">推荐歌曲</view>
      <view class="">
        <text>为你精心推荐</text>
        <text class="more">查看更多</text>
      </view>
    </view>
    <!-- 内容区 -->
    <scroll-view class="recommendScroll" enable-flex scroll-x>
      <view class="scrollItem" v-for="recommendListItem in recommendList" :key="recommendListItem.id">
        <image :src="recommendListItem.picUrl"></image>
        <text>{{recommendListItem.name}}</text>
      </view>
    </scroll-view>
  </view>

  <!-- 排行榜区域 -->
  <view class="topList">
    <!-- 头部区域 -->
    <view class="header">
      <view class="title">排行榜</view>
      <view class="">
        <text>热歌风向标</text>
      </view>
    </view>

    <!-- 内容区域 -->

    <swiper class="topListSwiper" circular next-margin="50rpx" previous-margin="50rpx">
      <swiper-item v-for="(topListItem,index) in topList" :key="index">
        <view class="swiperItem">
          <view class="title">{{topListItem.name}}</view>
          <view class="musicItem" v-for=" (topListItemSongInfo,index) in topListItem.songInfo" :key="index">
            <image :src="topListItemSongInfo.al.picUrl"></image>
            <text class="count">{{index + 1}}</text>
            <text class="musicName">{{topListItemSongInfo.al.name}}</text>
          </view>
        </view>
      </swiper-item>

    </swiper>
  </view>


</template>

<script>
  import {
    request
  } from '/utils/request.js'

  export default {
    data() {
      let bannerList, recommendList, topList;
      return {
        title: 'Hello',
        background: ['color1', 'color2', 'color3'],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        bannerList: [],
        recommendList: [],
        topList: [],
        index: 0
      }
    },
    onLoad: async function(options) {
      let bannerListData = await request('/banner', {
          type: 2
        },
        'get');
      this.bannerList = bannerListData.data.banners;
      console.log("bannerList", bannerListData.data.banners);

      // 获取推荐歌单数据
      let recommendListData = await request('/personalized', {
        limit: 10
      }, 'get');
      this.recommendList = recommendListData.data.result;
      console.log("recommendList", recommendListData.data.result);
      // 获取排行榜数据
      /*
       * 需求分析：
       *   1. 需要根据idx的值获取对应的数据
       *   2. idx的取值范围是0-20， 我们需要0-4
       *   3. 需要发送5次请求
       * 前++ 和 后++的区别
       *   1. 先看到是运算符还是值
       *   2. 如果先看到的是运算符就先运算再赋值
       *   3. 如果先看到的值那么就先赋值再运算
       * */
      let index = 0;
      // let topListData = await request('/toplist', {
      //   limit: 3
      // }, 'get');
      while (index < 5) {
        let topListData = await request('/toplist', {
          id: index++,
        }, 'get');
        // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
        console.log("topListData", topListData);


        let topListSongData = await request('/playlist/track/all', {
          id: topListData.data.list[index].id,
          limit: 10,
          offset: 1
        }, 'get');
        let topListItem = {
          name: topListData.data.list[index].name,
          songInfo: topListSongData.data.songs.slice(0, 3)
        };
        console.log("topListSongData", topListSongData);
        // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些

        this.topList.push(topListItem);

        // this.topList = itemArr;
        console.log("topList", this.topList);

      }
      // 更新topList的状态值, 放在此处更新会导致发送请求的过程中页面长时间白屏，用户体验差
      // this.setData({
      //   topList: resultArr
      // })
    },

    methods: {
      // 跳转至recommendSong页面的回调
      toRecommendSong() {
        wx.navigateTo({
          url: '/pages/recommendSong/recommendSong'
        })
      },
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .uni-margin-wrap {
    width: 690rpx;
    width: 100%;
  }

  .swiper {
    width: 100%;
    height: 300rpx;
  }

  .swiper image {
    width: 100%;
    height: 100%;
  }

  .swiper-item {
    display: block;
    height: 300rpx;
    line-height: 300rpx;
    text-align: center;
  }

  .swiper-list {
    margin-top: 40rpx;
    margin-bottom: 0;
  }

  .navContainer {
    display: flex;
  }

  .navItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
  }

  .navItem .iconfont {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 100rpx;
    background-color: #ff0000;
    font-size: 50rpx;
    color: #fff;
    margin: 20rpx 0;
  }

  .navItem text {
    font-size: 26rpx;
  }


  /* 推荐歌曲 */
  .recommendContainer {
    padding: 20rpx;
  }

  .recommendContainer .header .title {
    font-size: 32rpx;
    line-height: 80rpx;
    color: #666;
  }

  .recommendContainer .header .more {
    float: right;
    border: 1rpx solid #333;
    padding: 10rpx 20rpx;
    font-size: 26rpx;
    border-radius: 30rpx;

  }



  /* 推荐内容区*/
  .recommendScroll {
    display: flex;
    height: 300rpx;
    margin-top: 30rpx;
  }

  .scrollItem {
    width: 200rpx;
    margin-right: 20rpx;
  }

  .scrollItem image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 10rpx;

  }

  .scrollItem text {
    font-size: 26rpx;
    /* 单行文本溢出隐藏 省略号代替 */
    /*display: block;*/
    /*white-space: nowrap;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/

    /* 多行文本溢出隐藏 省略号代替*/
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    /*设置对其模式*/
    -webkit-line-clamp: 2;
    /*设置多行的行数*/
  }

  /* 排行榜  */
  .topList {
    padding: 20rpx;
  }

  .topListSwiper {
    height: 400rpx;
  }

  .swiperItem {
    width: 96%;
    background: #fbfbfb;
  }

  .swiperItem .title {
    font-size: 30rpx;
    line-height: 80rpx;

  }

  .musicItem {
    /* 当一个元素设置为flex，其子元素会自动成为block元素*/
    display: flex;
    margin-bottom: 20rpx;
  }

  .musicItem image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 6rpx;
  }

  .musicItem .count {
    width: 100rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
  }

  .musicItem .musicName {
    height: 100rpx;
    line-height: 100rpx;
    max-width: 400rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<template>
  <view class="searchContainer">
    <!-- 头部搜索区域 -->
    <view class="header">
      <view class="searchInput">
        <text class="iconfont icon-search1 searchIcon"></text>
        <input type="text" :value="searchContent" :placeholder="placeholderContent" placeholder-class="placeholder"
          :input="handleInputChange" />
        <text class="clear" @click="clearSearchContent" v-if="searchContent">X</text>
      </view>
      <text class="cancel">取消</text>
    </view>

    <block v-if="searchList.length">
      <!-- 搜索内容展示 -->
      <view class="showSearchContent">
        <view class="searchContent">搜索内容: {{ searchContent }}</view>
        <view class="searchList">
          <view class="searchItem" v-for="(item, index) in searchList" :key="item.id">
            <text class="iconfont icon-search1"></text>

            <text class="content">{{ item.name }}</text>
          </view>
        </view>
      </view>
    </block>

    <block v-else>
      <!-- 搜索历史记录 -->
      <view class="history" v-if="historyList.length">
        <view class="title">历史</view>
        <view class="historyItem" v-for="(item, index) in historyList" :key="index">
          {{ item }}
        </view>
        <!-- 删除 -->
        <text class="iconfont icon-shanchu delete" @click="deleteSearchHistory"></text>
      </view>
      <!-- 热搜榜 -->
      <view class="hotContainer">
        <view class="title">热搜榜</view>
        <!-- 热搜列表 -->
        <view class="hotList">
          <view class="hotItem" v-for="(item, index) in hotList" :key="item.searchWord">
            <text class="order">{{ index + 1 }}</text>

            <text>{{ item.searchWord }}</text>

            <image class="iconImg" v-if="item.iconUrl" :src="item.iconUrl"></image>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
  import {
    request
  } from '/utils/request.js';
  let isSend = false; // 函数节流使用

  export default {
    data() {
      return {
        placeholderContent: '',
        // placeholder的内容
        hotList: [],
        // 热搜榜数据
        searchContent: '',
        // 用户输入的表单项数据
        searchList: [],
        // 关键字模糊匹配的数据
        historyList: [] // 搜索历史记录
      };
    }
    /**
     * 生命周期函数--监听页面加载
     */
    ,
    onLoad: function(options) {
      // 获取初始化数据
      this.getInitData(); // 获取历史记录

      this.getSearchHistory();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},
    methods: {
      // 获取初始化的数据
      async getInitData() {
        let placeholderData = await request('/search/default');
        let hotListData = await request('/search/hot/detail');
        this.placeholderContent = placeholderData.data.showKeyword;
        this.hotList = hotListData.data

      },

      // 获取本地历史记录的功能函数
      getSearchHistory() {
        let historyList = uni.getStorageSync('searchHistory');

        if (historyList) {
          this.historyList = historyList

        }
      },

      // 表单项内容发生改变的回调
      handleInputChange(event) {
        // console.log(event);
        // 更新searchContent的状态数据
        this.searchContent = event.detail.value.trim()


        if (isSend) {
          return;
        }

        isSend = true;
        this.getSearchList(); // 函数节流

        setTimeout(() => {
          isSend = false;
        }, 300);
      },

      // 获取搜索数据的功能函数
      async getSearchList() {
        if (!this.searchContent) {
          this.searchList = []

          return;
        }

        let {
          searchContent,
          historyList
        } = this; // 发请求获取关键字模糊匹配数据

        let searchListData = await request('/search', {
          keywords: searchContent,
          limit: 10
        });
        this.searchList = searchListData.result.songs
        // 将搜索的关键字添加到搜索历史记录中

        if (historyList.indexOf(searchContent) !== -1) {
          historyList.splice(historyList.indexOf(searchContent), 1);
        }

        historyList.unshift(searchContent);
        this.historyList = historyList

        uni.setStorageSync('searchHistory', historyList);
      },

      // 清空搜索内容
      clearSearchContent() {
        this.searchContent = '',
          this.searchList = []

      },

      // 删除搜索历史记录
      deleteSearchHistory() {
        uni.showModal({
          content: '确认删除吗?',
          success: (res) => {
            if (res.confirm) {
              // 清空data中historyList
              this.historyList = []
              // 移除本地的历史记录缓存

              uni.removeStorageSync('searchHistory');
            }
          }
        });
      }
    }
  };
</script>
<style>
  /* pages/search/search.wxss */
  .searchContainer {
    padding: 0 20rpx;
  }

  .header {
    display: flex;
    height: 60rpx;
    line-height: 60rpx;
    padding: 10rpx 0;
  }

  .searchInput {
    position: relative;
    flex: 1;
    background: rgba(237, 237, 237, 0.3);
    border-radius: 30rpx;
  }

  .clear {
    position: absolute;
    right: 30rpx;
    z-index: 10;
    top: 0;
    font-size: 30rpx;
  }

  .cancel {
    width: 100rpx;
    text-align: center;
  }

  .searchIcon {
    position: absolute;
    left: 15rpx;
  }

  .searchInput input {
    margin-left: 50rpx;
    height: 60rpx;
  }

  .placeholder {
    /*color: #d43c33;*/
    font-size: 28rpx;
  }

  /* 热搜榜 */
  .hotContainer {
    margin-top: 30rpx;
  }

  .hotContainer .title {
    font-size: 28rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-bottom: 1rpx solid #eee;
  }

  .hotList {
    display: flex;
    flex-wrap: wrap;
  }

  .hotItem {
    width: 50%;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 26rpx;
  }

  .hotItem .order {
    margin: 0 10rpx;
  }

  .hotItem .iconImg {
    width: 35rpx;
    height: 20rpx;
    margin-left: 10rpx;
  }

  /* 搜索内容展示 */
  .searchContent {
    color: #d43c33;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 24rpx;
    border-bottom: 1rpx solid #d43c33;
  }

  .searchItem {
    height: 80rpx;
    line-height: 80rpx;
    display: flex;
  }

  .searchItem .content {
    flex: 1;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;
    font-size: 26rpx;
  }

  /* 搜索历史 */
  .history {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    line-height: 50rpx;
    margin: 20rpx 0;
  }

  .history .title {
    font-size: 28rpx;
    height: 50rpx;
  }

  .history .historyItem {
    height: 50rpx;
    font-size: 26rpx;
    background: #ededed;
    margin-left: 20rpx;
    padding: 0 30rpx;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
  }

  .history .delete {
    position: absolute;
    bottom: 10rpx;
    right: 15rpx;
    font-size: 36rpx;
  }
</style>

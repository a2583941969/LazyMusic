<template>
  <view class="search-page">
    <!-- 头部搜索框 -->
    <view class="first">
      <view class="search-head">
        <view class="head-left">
          <uni-search-bar
            :radius="100"
            v-model="value"
            cancelButton="none"
            placeholder="搜索音乐、歌手、专辑"
            bgcolor="#fff"
          ></uni-search-bar>
        </view>
        <view class="search-cancel">
          <!-- <navigator>取消</navigator> -->
          <view class @click.native="goIndex">取消</view>
        </view>
      </view>
      <view class="SegmentedControl">
        <view class="container">
          <text
            :class="index==active?'active':'nav-item'"
            @click="NavClick"
            :data-type="item.type"
            :data-index="index"
            v-for="(item,index) of items"
            :key="index"
          >{{item.name}}</text>
        </view>
      </view>
    </view>
    <!-- 去搜索一下吧 -->
    <view class="to-search" v-if="this.info.length==0">
      <text>点击上方搜索栏会有意想不到的东西哦</text>
    </view>
    <view class="content" v-else>
      <scroll-view scroll-y="true" class="search-scroll">
        <view v-if="this.active == 0">
          <my-songlist
            style="margin-bottom: 30rpx;"
            v-for="(i,k) of info"
            :key="k"
            :sid="i.id"
            :sname="i.name"
            :alnumName="i.al.name"
            :singer="i.ar[0].name"
            :sing_img="i.al.picUrl"
            :isAlnum="false"
            @click.native="playSong({songid:i.id})"
          ></my-songlist>
        </view>
        <view v-else-if="this.active == 1">
          <my-songlist
            style="margin-bottom: 30rpx;"
            v-for="(i,k) of info"
            :key="k"
            :sid="i.id"
            :sname="i.name"
            :alnumName="i.al.name"
            :singer="i.ar[0].name"
            :sing_img="i.al.picUrl"
            :isAlnum="false"
            @click.native="playSong({songid:i.id})"
          ></my-songlist>
        </view>
        <view v-else-if="this.active == 2">
          <my-songlist
            style="margin-bottom: 30rpx;"
            v-for="(z,j) of info"
            :key="j"
            :sid="z.id"
            :sname="z.name"
            :singer="z.artist.name"
            :sing_img="z.picUrl"
            :isAlnum="false"
            @click.native="GoToAlnums(z.id)"
          >
            <view class>{{z.size}}首单曲</view>
          </my-songlist>
        </view>
        <view v-else="this.active==3">
          <my-songlist
            style="margin-bottom: 30rpx;"
            v-for="(singer,index) of info "
            :sid="singer.id"
            :sname="singer.name"
            :sing_img="singer.picUrl"
            @click.native="goSongList(singer.id)"
          >
            <view class>{{singer.albumSize}}首单曲</view>
          </my-songlist>
        </view>
      </scroll-view>
    </view>
    <view class="search-albumplay">
      <AlbumPlay></AlbumPlay>
    </view>
  </view>
</template>

<script>
// 引入搜索框
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
// 引入mySongList组件
import mySonglist from "../../myComponents/my-songlist/mySongList.vue";
// 引入专辑组件
import myAlnum from "../../myComponents/my-alnum/myAlnum.vue";
export default {
  components: {
    uniSearchBar,
    mySonglist,
    myAlnum,
  },
  data() {
    return {
      // items: ['全部', '单曲', '专辑'],
      items: [
        {
          name: "全部",
          type: 1,
        },
        {
          name: "单曲",
          type: 1,
        },
        {
          name: "专辑",
          type: 10,
        },
        {
          name: "歌手",
          type: 100,
        },
      ],
      // 头部nav当前选中的值
      active: 0,
      // 搜索框传入的值
      value: "",
      // 定时器ID
      TimeId: null,
      // 请求返回回来的数据
      info: [],
      // 搜索类型
      type: 1,
      // 页码
      page: 1,
    };
  },
  methods: {
    // 点击切换nav
    NavClick(e) {
      let { index, type } = e.currentTarget.dataset;
      this.active = index;
      this.info = [];
      this.type = type;
      if (this.value.value) {
        this.getinfo(type);
      }
    },
    async getData(url) {
      return await this.$myReq({
        url,
        method: "get",
      });
    },
    // 搜索请求函数
    getinfo(count) {
      count = !count ? this.type : count;
      this.getData(
        "cloudsearch?keywords=" +
          this.value.value +
          "&type=" +
          count +
          "&offset=" +
          this.page
      ).then((res) => {
        let arr = [];
        if (this.type == 1) {
          arr = res.data.result.songs;
        } else if (this.type == 10) {
          arr = res.data.result.albums;
        } else {
          arr = res.data.result.artists;
        }
        arr.forEach((item) => {
          item.picUrl = item.picUrl + "?imageView=1&type=webp&thumbnail=246x0"; // 将图片路径拼接上移动端使用的路径
          this.info.push(item);
        });
        console.log(res)
      });
    },
    // 点击播放歌曲
    playSong(songID) {
      // 将首页歌曲的数组 替换到vuex中的播放列表页数组
      // 将当前点击的歌曲id传递到click-to-play组件
      uni.$emit("updeta", songID);
    },
    // 跳转到专辑页面
    GoToAlnums(id) {
      let sid = id;
      let bool = false;
      // this.$router.push({path:'/pages/songlist/songlist',params:{id:id,status:status}})
      uni.navigateTo({
        url: "/pages/songlist/songlist?id=" + sid + "&status=" + bool,
        animationType: "none",
      });
    },
    // 跳转到歌手信息页面
    goSongList(id) {
      let sid = id;
      uni.navigateTo({
        url: "/pages/artist/artist?id=" + sid,
        animationType: "none",
      });
    },
    // 返回首页
    goIndex() {
      uni.navigateTo({
        url: "/pages/index/index",
        animationType: "none",
      });
    },
  },
  watch: {
    value() {
      // 先清空定时器
      clearTimeout(this.TimeId);
      if (this.value.value.trim()) {
        this.TimeId = setTimeout(() => {
          this.info = [];
          this.getinfo();
        }, 1000);
      }
    },
  },
  onReachBottom() {
    this.page++;
    this.getinfo();
  },
};
</script>

<style scoped>
.search-page {
  position: relative;
  background-color: #ffffff;
}

.search-page > .first {
  background-color: #ffffff;
}

.search-page > .first > .search-head {
  width: 100%;
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
  position: fixed;
  /* top: 40rpx; */
  top: 0rpx;
  left: 0;
  z-index: 20;
  background-color: #ffffff;
}

.search-page > .first > .search-head > .head-left {
  width: 600rpx;
}

.search-page > .first > .search-head > .search-cancel {
  font-size: 26rpx;
  padding-left: 20rpx;
  color: #aaa;
  background-color: #ffffff;
}

.search-page > .first > .SegmentedControl {
  position: fixed;
  top: 164rpx;
  left: 0;
  z-index: 21;
  background-color: #fff;
  padding: 20rpx 0;
  width: 100%;
}

.search-page > .first > .SegmentedControl > .container {
  width: 460rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 26rpx;
}

.search-page > .first > .SegmentedControl > .container > .nav-item {
  color: #999;
  padding-bottom: 10rpx;
}

.active {
  color: #000000;
  border-bottom: 2px solid #000000;
  padding-bottom: 10rpx;
}

.search-page > .content {
  font-size: 24rpx;
  margin-top: 20rpx;
}

.search-scroll {
  padding: 240rpx 8rpx 0;
  margin-bottom: 120rpx;
}

.to-search {
  position: absolute;
  top: 260rpx;
  left: 0;
  text-align: center;
  width: 100%;
  color: #aaaaaa;
  font-size: 26rpx;
}

.search-albumplay {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>

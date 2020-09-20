<template>
	
	<swiper duration="1000" style="height: 100vh;">
		<swiper-item>
			<view class="playPage">
				<view class="song">
					<image :src="bgimage" mode="widthFix" class="bg-set"></image>
					<!-- 歌曲页面状态栏,点击之后返回上一页 -->
					<view class="songStatusBar" @click="navigatorBack">
						<image src="../../static/icon/arrow-down.png" mode=""></image>
					</view>
					<!-- 歌曲页背景文字区域 -->
					<view class="songContent">
						<text class="albumName-title">{{this.store.state.songName}}</text>
						<text class="albumName">来自专辑：{{this.store.state.albumName.length?this.store.state.albumName:'暂无专辑'}}</text>
						<text class="singer">{{this.store.state.singer}}</text>
					</view>
					<view class="lyric">
							<text style="color:#007AFF">{{currentLrc}}</text>
					</view>
					<view class="process">
						<slider backgroundColor="#7f8fa6" activeColor="#fad390" :value="this.store.state.currentTime" min="0" :max="this.store.state.songLength"
						 @change="sliderChange" block-size="12"></slider>
					</view>
					<!-- 底部播放框-->
					<view class="playBox">
						<view class="playControl">
							<image src="../../static/icon/loop.png" mode="widthFix"></image>
							<image src="../../static/icon/prev.png" mode="widthFix" @click="prevSong"></image>
							<image :src="this.$store.state.musicOn?'../../static/icon/pause-outline-filled.png':'../../static/icon/play-filled.png'"
							 mode="widthFix" @click="startPlay"></image>
							<image src="../../static/icon/next.png" mode="widthFix" @click="nextSong"></image>
							<image src="../../static/icon/time.png" mode="widthFix"></image>
						</view>
						<view class="more">
							<view class="downLoad">
								<image src="../../static/icon/download.png" mode=""></image>
								<text>下载</text>
							</view>
							<view class="collect">
								<image src="../../static/icon/collection.png" mode=""></image>
								<text>收藏</text>
							</view>
							<view class="share">
								<image src="../../static/icon/partager.png" mode=""></image>
								<text>分享</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</swiper-item>
	<!-- 	这里是歌词列表页 -->
		<swiper-item>
			<view class="playList">
				<!-- <image src="../../static/122.jpg" mode="" class="bg-set"></image> -->
				<view class="songStatusBar" @click="navigatorBack">
					<image src="../../static/icon/arrow-down.png" mode=""></image>
				</view>
				<view class="listName">
					<text>播放列表</text>
					<text>1首</text>
				</view>
			</view>
			
		</swiper-item>
	</swiper>
	
	
</template>

<script>
	import Lyric from 'lyric-parser';
	export default {
		data() {
			return {
				id: null,
				//背景图片
				bgimage: '',
				//是否在播放
				isPlay: true,
				//显示出来，在页面展示的歌词
				currentLrc: '',
				//定义一个当前歌词播放到哪儿的一个行数,初始化为0
				currentLrcNum:0
			}
		},
		onLoad(options) {
			//获取传过来的专辑图片
			this.bgimage = options.albumPic
			this.id =options.id;
			// console.log(this.id);
			//利用获取的歌曲id 查询当前歌曲的歌词
			this.getLyric(this.id);
		},
		methods: {
			//处理实例化歌词的回调
			handler({lineNum,txt}){
				//获取当前播放的行数
				this.currentLrcNum = lineNum;
				this.currentLrc =txt
			},
			//获取歌词
			async getLyric(id) {
				let res = await this.$myReq({
					url: 'lyric?id=' + id,
					methods: 'GET'
				});
				let {
					lyric
				} = res.data.lrc;
				let {musicOn} = this.store.state;
				// 如果这首歌有歌词的话
				if(lyric){
					//初始化歌词实例的时候，第一个参数是获取的歌词数据，第二个是处理播放状态的回调函数
					this.currentLrc = new Lyric(lyric,this.handler);
					if(musicOn){
						this.currentLrc.play();
					}
				}else{
					this.showLrc ="暂无歌词"
				}
			},
			sliderChange(e) {
				// console.log(e.target.value)
				// 获取拖住事件的值,然后尝试赋值给音乐的当前时长,改变进度条
				let value = e.target.value;
				//从vuex中取出这个音乐的实例化对象
				let {
					audioEle
				} = this.store.state;
				//当用户改变进度条的value值的时候，就动态操作音乐的播放进度
				audioEle.currentTime = value
			},
			//点击获取上一个歌曲
			prevSong() {
				console.log('切换上一个歌曲')
			},
			nextSong() {
				console.log('切换下一个歌曲')
			},
			navigatorBack() {
				uni.navigateBack()
			},
			startPlay() {
				let {
					audioEle
				} = this.store.state;
				this.isPlay = !this.isPlay;
				//若全局有音乐在播放，点击事件就应该让他停止
				if (this.store.state.musicOn) {
					audioEle.pause();
				} else {
					// 否则就让他播放
					audioEle.play();
				}
				this.store.state.musicOn = !this.store.state.musicOn
			}
		},
	}
</script>

<style>
page {color: #FFFFFF;}
/* 歌曲播放页面的样式 */
.playPage{height: 100vh;}
.playPage>.song{width: 100%;height: 80vh;}
.playPage>.song::before{content:'';display: block;width: 100%;height:70%;bottom: 0; position: absolute;z-index: -1;background: linear-gradient(top,#FFFFFF00,#1d283d,#1d283d,#1d283d,#1d283d,#172238);}
.playPage>.song::after{content:'';display: block;width: 100%;height:100%;position: absolute;top:0;z-index: -2;background: linear-gradient(bottom,#172238,#FFFFFF00);}
.process{margin-top: -120rpx;}
.playPage .playBox .more {width: 750rpx;display: flex;flex-wrap: nowrap;justify-content: center;}
.playPage .playBox .more>view {margin-top: 50rpx;width: 50rpx;height: 50rpx;font-size: 12rpx;}
.playPage .lyric {margin-top: 120rpx; font-size: 40rpx;overflow: hidden;height: 300rpx;margin-bottom: 110rpx;text-align: center;}
.playPage .playBox .more>view>image {width: 100%;height: 100%;}
.lyric-wrapper .lyricItem{color:gray;line-height:60rpx;}
.playPage .playBox .more>view:nth-child(2) {margin-left: 70rpx;margin-right: 70rpx;}
.playPage .playControl {margin-top: 200rpx;display: flex;flex-wrap: nowrap;justify-content: space-around;}
.playPage .playControl>image {width: 50rpx;height: 50rpx;}.playPage .playControl>image:nth-child(3) {width: 150rpx;height: 150rpx;}
.playPage .playControl>image:not(:nth-child(3)) {margin-top: 60rpx;}
.playPage .playBox {width: 750rpx;height: 40%;position: absolute;bottom: 0;background-color: transparent;}
.playPage .songContent {margin-top: 20%;margin-left: 90rpx;margin-right: 90rpx;}
.playPage .albumName-title {font-size: 70rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap}
.playPage .albumName,.playPage .singer {font-size: 25rpx;}
.songContent>text {display: block;padding-bottom: 15rpx;}
/* 歌曲列表展示出来的样式 */
.playList{background-color: red; width: 100%; height: 100vh;}
.playList::before{content: '';display: block;width: 100%;height: 100vh;position: absolute;}
.playPage .song {box-sizing: border-box;padding-top: 90rpx;}
.songStatusBar {width: 60rpx;height: 60rpx;margin-left: 90rpx;}
.songStatusBar>image {width: 100%;height: 100%;}
.playList .songStatusBar {padding-top: 100rpx;}
.playPage .bg-set,.playList .bg-set {position: fixed;width: 100%;height: 100%;top: 0;left: 0;z-index: -3;}
.playList>.listName{display: block; margin: 50rpx 90rpx;}
.playList>.listName>text:first-child{color: #999999;}
.playList>.listName>text:nth-child(2){font-size: 30rpx; margin: 0 20rpx;}
</style>

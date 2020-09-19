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
	export default {
		data() {
			return {
				id: 1463168014,
				bgimage: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599988611425&di=868b6430664d42152e80dd2a01c4866a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F21%2F20151121140727_JuM5a.jpeg',
				albumName: null,
				singer: null,
				songUrl: '',
				isPlay: true,
				songName: '',
				lyric: [],
				showLrc: ''
			}
		},
		onLoad(options) {
			//获取传过来的专辑图片
			this.bgimage = options.albumPic
		},
		methods: {
			//获取歌词
			async getLyric(id) {
				let res = await this.$myReq({
					url: 'lyric?id=' + id,
					methods: 'GET'
				});
				// console.log(res.data.lrc)
				// let {
				// 	lyric
				// } = res.data.lrc;
				// let arrLyric = lyric.split('\n')
				// // 正则表达式匹配歌词前缀
				// let regExp = /\[(\d*(\:)*\d*\.\d*)\]/g;
				// let time = [];
				// arrLyric.forEach((item) => {
				// 	let arr = item.split("]")
				// 	//获取分钟数
				// 	let mins = arr[0].substring(1).split(":")[0];
				// 	//获取秒数
				// 	let sec = arr[0].substring(1).split(":")[1];
				// 	//转换成秒数
				// 	let timer = (mins * 60) + (sec * 1);
				// 	timer = Number(timer.toString().split(".")[0])

				// 	let obj = {
				// 		time: timer,
				// 		geci: arr[1]
				// 	}
				// 	time.push(obj);
				// })
				// //从数组的末尾删除一个空的成员
				// time.pop();
				// console.log(time)
				// //遍历这个time，如果time的时间节点与当前播放的事件节点重复，那么我就让对应的歌词显示在页面上
				// let {
				// 	audioEle
				// } = this.store.state;


				// let lyrics = lyric.replace(regExp, '');
				// console.log(lyrics)
				// // 正则匹配换行转义字符
				// let reg = /\n/g;
				// let arrLrc = lyrics.split(reg)
				// this.lyric = arrLrc
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
		// onShow() {

		// 	//页面每次渲染完成
		// 	// 取出状态管理器的audio实例
		// 	let {
		// 		audioEle
		// 	} = this.store.state
		// 	//获取当前实例的播放位置，赋值给进度条的value

		// 	this.newVal = audioEle.currentTime

		// },

	}
</script>

<style>
page {color: #FFFFFF;}
/* 歌曲播放页面的样式 */
.playPage{height: 100vh;}
.playPage>.song{width: 100%;height: 80vh;}
.playPage>.song::before{content:'';display: block;width: 100%;height:70%;bottom: 0; position: absolute;z-index: -1;background: linear-gradient(top,#FFFFFF00,#1d283d,#1d283d,#1d283d,#1d283d,#172238);}
.playPage>.song::after{content:'';display: block;width: 100%;height:100%;position: absolute;top:0;z-index: -2;background: linear-gradient(bottom,#172238,#FFFFFF00);}
.process{margin-top: 200rpx;}
.playPage .playBox .more {width: 750rpx;display: flex;flex-wrap: nowrap;justify-content: center;}
.playPage .playBox .more>view {margin-top: 50rpx;width: 50rpx;height: 50rpx;font-size: 12rpx;}
.playPage .lyric {margin: 30rpx 90rpx;font-size: 30rpx;overflow: hidden;height: 150rpx;margin-bottom: 110rpx;text-align: center;}
.playPage .playBox .more>view>image {width: 100%;height: 100%;}
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

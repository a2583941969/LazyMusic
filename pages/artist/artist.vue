

<template>
	<view class="ablum">
		<view class="up" :style="{backgroundImage:'url('+img+')'}">
		</view>
		<scroll-view class="main">
			<view class="empty">
			</view>
			<!-- 信息展示 -->
			<view class="mianinfo">
				<!-- 专辑/歌手标题 -->
				<view class="ablumtitle">
					<view class="artistname" v-if="artistInfo.artist">
						{{artistInfo.artist.name}}
					</view>
					<view class="artistbtn">
						<view>
							<image src="../../static/icon/G_soucang.png" mode=""></image>收藏
						</view>
						<view>
							<image src="../../static/icon/G_fenxiang.png" mode=""></image>分享
						</view>
					</view>
				</view>
				<!-- 专辑/歌手标题结束 -->
				<!-- 标签切换 -->
				<view class="SegmentedControl">
					<view class="container">
						<text :class="index==active?'active':'nav-item'" @click="NavClick" :data-index="index" v-for="(item,index) of items"
						 :key="index">{{item}}</text>
					</view>
				</view>
				<view class="content">
					<!-- 热门歌曲选项卡 -->
					<view v-if="this.active==0">
						<view class="ablumbtn">
							<view class="playall" @click="playAll">
								<image src="../../static/icon/play.png" mode=""></image> 播放全部
							</view>
							<view class="smbtn">
								<view @click="collect">
									<image src="../../static/icon/G_soucang.png" mode=""></image>
								</view>
								<view @click="share">
									<image src="../../static/icon/G_fenxiang.png" mode=""></image>
								</view>
								<view @click="download">
									<image src="../../static/icon/G_xiazai.png" mode=""></image>
								</view>
							</view>
						</view>
						<view class="songbox" v-if="artistInfo">
							<my-songlist style="margin-bottom: 30rpx;" v-for="(i,k) of artistInfo.hotSongs" :key="k" :sid="i.id" :sname="i.name"
							 :alnumName="i.al.name" :singer="i.ar[0].name" :sing_img="i.al.picUrl" :isAlnum="false" @click.native="playSong({songid:i.id})">
							</my-songlist>
							<!-- 歌曲列表项 -->
						</view>
					</view>
					<!-- 专辑选项卡 -->
					<view v-else="this.active==1" class="albumbox">
						<my-songlist style="margin-bottom: 30rpx;" v-for="(i,k) of albumItems" :key="k" :sid="i.id" :sname="i.name"
						 :alnumName="i.publictime" :singer="i.name" :sing_img="i.picUrl" :isAlnum="false" @click.native="toAblumlist(i.id)">
								<view class="songsize">
									{{i.size}}首歌曲
								</view>
						</my-songlist>
					</view>
				</view>
			</view>
		</scroll-view>
		<AlbumPlay class="artist-albumplay"></AlbumPlay>
	</view>
</template>

<script>
	import mySonglist from "../../myComponents/my-songlist/mySongList.vue"
	export default {
		components: {
			mySonglist
		},
		data() {
			return {
				active: 0,
				artistInfo: [],
				albumItems: [],
				// img: 'http://p1.music.126.net/gA6MMdcY7WRNm0bs3W4E7w==/18651015743968707.jpg',
				img: '',
				items: ['热门歌曲', '全部专辑']
			}
		},
		onLoad: function(option) {
			let id = option.id * 1;
			this.getAlbum(id);
			this.getArtist(id)
		},
		methods: {
			//点击播放
			playSong(songID){
				uni.$emit("updeta",songID)
			},
			//选项卡切换
			NavClick(e) {
				let {
					index
				} = e.currentTarget.dataset;
				this.active = index;
			},
			//前往专辑歌单列表
			toAblumlist(id) {
				let sid = id;
				let bool = false;
				// this.$router.push({path:'/pages/songlist/songlist',params:{id:id,status:status}})
				uni.navigateTo({
					url: "/pages/songlist/songlist?id=" + sid + '&status=' + bool,
					animationType: "none"
				})
			},
			//获取专辑
			async getAlbum(id) {
				let url='artist/album?id='+id+'&limit=30'
				let res = await this.$myReq({
					url: url,
					method: 'GET'
				});
				let datas = res.data.hotAlbums;
				for (let i of datas) {
					let date = new Date(i.publishTime);
					let year = date.getFullYear();
					let month = date.getMonth();
					let day = date.getDate();
					let times = [];
					times.push(year, month, day);
					let time = times.join('.');
					//为每一个对象添加一个新属性publictime并赋值
					i.publictime = time;
				}
				this.albumItems = datas;
			},
			//获取热门歌曲
			async getArtist(id) {
				let url='artists?id='+id;
				let res = await this.$myReq({
					url: url,
					method: 'GET'
				});
				this.artistInfo = res.data;
				this.img = res.data.artist.img1v1Url;
				//动态修改导航栏标题
				uni.setNavigationBarTitle({
					title: this.artistInfo.artist.name
				})
			},
			//收藏
			collect() {
				console.log('收藏');
			},
			//分享
			share() {
				console.log('分享');
			},
			//下载
			download() {
				console.log('下载')
			},
			//播放全部
			playAll() {
				console.log('播放全部')
			}
		},
	}
</script>

<style>
	.albumbox {
		margin-bottom: 40rpx;
		padding-bottom: 40rpx;
	}

	.artist-albumplay {
		position: fixed;
		bottom: 0;
	}

	.songsize {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.SegmentedControl {
		margin-top: 20rpx;
		width: 90%;
	}

	.SegmentedControl>.container {
		width: 270rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;

	}

	.SegmentedControl>.container>.nav-item {
		color: #999;
		padding-bottom: 10rpx;

	}

	.active {
		color: #000000;
		border-bottom: 2px solid #000000;
		padding-bottom: 15rpx;
	}

	.content {
		width: 90%;
		padding: 0 26rpx;
		margin-top: 20rpx;
		font-size: 24rpx;
	}

	.songbox {
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-evenly;
		align-items: center;
		margin: 40rpx 0;
	}

	.ablumbtn .smbtn {
		width: 200rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ablumbtn .smbtn image {
		width: 35rpx;
		height: 35rpx;
	}

	.ablumbtn .playall image {
		width: 30rpx;
		height: 30rpx;
		vertical-align: middle;
	}

	.ablumbtn .playall {
		width: 150rpx;
		background-color: #f9f9f9;
		border-radius: 50rpx;
		font-size: 24rpx;
		padding: 15rpx 25rpx;
		color: #333;
		text-align: center;
		line-height: ;
	}

	.ablumbtn {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.ablumtitle {
		width: 90%;
		background-color: #fff;
		margin: 50rpx 0;
	}

	.artistname {
		font-size: 40rpx;
		font-weight: bold;
		color: #000;
	}

	.artistbtn {
		display: flex;
		font-size: 23rpx;
		margin-top: 35rpx;
		align-items: center;
		line-height: 24rpx;
	}

	.artistbtn view:first-child {
		margin-right: 80rpx;
	}

	.artistbtn image {
		width: 23rpx;
		height: 23rpx;
		vertical-align: middle;
		margin-right: 6px;
	}

	.mianinfo {
		width: 100%;
		height: 100%;
		background-color: #fff;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.empty {
		width: 100%;
		height: 500rpx;
	}

	.mian {
		width: 100%;
		height: 100%;
		background-color: rgba(50, 36, 185, 0.0);
		position: absolute;
		z-index: 99;

	}

	.ablum {
		width: 100%;

	}

	.up {
		position: fixed;
		width: 100%;
		height: 750rpx;
		background-repeat: repeat;
		background-size: 100% 100%;
		background-position: 0 -180rpx;
	}
</style>

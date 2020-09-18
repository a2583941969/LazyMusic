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
					<view class="artistname">
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
						<view class="songbox" >
							<my-songlist style="margin-bottom: 30rpx;" v-for="(i,k) of artistInfo.hotSongs" :key="k" :sid="i.id" :sname="i.name"
							 :alnumName="i.al.name" :singer="i.ar[0].name" :sing_img="i.al.picUrl" :isAlnum="false">
							</my-songlist>
							<!-- 歌曲列表项 -->
						</view>
					</view>
					<!-- 专辑选项卡 -->
					<view v-else="this.active==1" class="albumbox" >
						<my-songlist style="margin-bottom: 30rpx;" v-for="(i,k) of albumItems" :key="k" :sid="i.id" :sname="i.name" 
						 :alnumName="i.publictime" :singer="i.name" :sing_img="i.picUrl" :isAlnum="false" @click.native="toAblumlist(i.id,true)">
							<slot>
								<view class="songsize">
									{{i.size}}首歌曲
								</view>
							</slot>
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
				artistInfo: null,
				albumItems: null,
				// img: 'http://p1.music.126.net/gA6MMdcY7WRNm0bs3W4E7w==/18651015743968707.jpg',
				img: '',
				items: ['热门歌曲', '全部专辑']
			}
		},
		methods: {
			//选项卡切换
			NavClick(e) {
				let {
					index
				} = e.currentTarget.dataset;
				this.active = index;
			},
			//前往专辑歌单列表
			toAblumlist(id,status){
				console.log(id);
				console.log(status);
				// let id=id;
				// let status=status;
				
				this.$router.push({path:'/pages/songlist/songlist',params:{id:id,status:status}})
			},
			//获取专辑
			async getAlbum() {
				let res = await this.$myReq({
					url: 'artist/album?id=7219&limit=30',
					method: 'GET'
				});
				// console.log(res.data);
				// console.log(res.data.hotAlbums[0].name);
				// console.log(res.data.hotAlbums[0].picUrl);
				// console.log(res.data.hotAlbums[2].size);
				// console.log(res.data.hotAlbums[2].id);
				// console.log(res.data.hotAlbums[2].publishTime);
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
			async getArtist() {
				let res = await this.$myReq({
					// url:"song/url?id=1407551413",
					// url:"top/playlist/highquality?before=1503639064232&limit=6",
					// url: "playlist/detail?id=819618896", 
					//819618896 3025491905  	3025491896 3025496710
					url: 'artists?id=7219',
					method: 'GET'
				});
				// this.artistSong = res.data.playlist;
				// console.log(res.data);
				// console.log(res.data.artist.name);//歌手名
				// console.log(res.data.artist.img1v1Url);//歌手图片
				// console.log(res.data.hotSongs[0]);//热门歌曲
				// console.log(res.data.hotSongs[0].al.picUrl);//歌曲图片
				// console.log(res.data.hotSongs[0].name);//歌曲名
				// console.log(res.data.hotSongs[0].al.name);//专辑名
				// this.artistSong=res.data.hotSongs;
				this.artistInfo = res.data;
				this.img = res.data.artist.img1v1Url;
				//动态修改导航栏标题
				uni.setNavigationBarTitle({
					title:this.artistInfo.artist.name
				})
			},
			//测试获取歌单
			async getgedan() {
				let res = await this.$myReq({
					url: 'top/playlist/highquality?before=1503639064232&limit=10',
					method: 'GET'
				});
				for (let i of res.data.playlists) {
					// console.log(i.id)
				}
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
		created() {
			this.getArtist(),
			this.getAlbum(),
			this.getgedan()
		},

	}
</script>

<style>
	.albumbox{
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

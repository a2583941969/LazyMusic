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
					<text>{{songlist.name||ablumtitle.name}}</text><br>
					<text>{{songlist.trackCount||ablumtitle.size}}首单曲</text>
				</view>
				<!-- 专辑/歌手标题结束 -->
				<!-- 操作按钮 -->
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
				<!-- 操作按钮结束 -->
				<!-- 歌曲列表 -->
				<view class="songbox">
					<my-songlist style="margin-bottom: 30rpx;" v-for="(i,k) of songlist.tracks||ablumlist" :key="k" :sid="i.id" :sname="i.name"
					 :alnumName="i.al.name" :singer="i.ar[0].name" :sing_img="i.al.picUrl" :isAlnum="false" @click.native="playSong({songid:i.id})">
					</my-songlist>
					<!-- 歌曲列表项 -->
				</view>
			</view>
		</scroll-view>
		<AlbumPlay class="songlist-albumplay"></AlbumPlay>
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
				songlist: '',
				ablumlist: '',
				ablumtitle: '',
				img: '',
				id:'',
				status:'',
				
			}
		},
		onLoad: function(option) {
			console.log(option)
			// console.log(option.id)
			console.log(option.status, typeof(option.status))
			this.id = option.id * 1;
			this.status = option.status;
			this.getsong(this.id, this.status)
		},
		methods: {
			//点击播放
			playSong(songID){
				uni.$emit("updeta",songID)
			},
			
			// 获取歌曲列表
			async getsong(id, status) {
				if (status == 'true') {
					//歌单接口
					let url="playlist/detail?id="+id;
					let res = await this.$myReq({
						url:url,
						method: 'GET'
					});
					this.songlist = res.data.playlist;
					this.img = res.data.playlist.coverImgUrl;
					//动态修改导航栏标题
					uni.setNavigationBarTitle({
						title: this.songlist.name
					})
				} else {
					//专辑接口
					let url = 'album?id=' + id;
					let res = await this.$myReq({
						url: url,
						method: 'GET'
					});
					this.img = res.data.album.picUrl;
					this.ablumtitle = res.data.album;
					this.ablumlist = res.data.songs;
					//动态修改导航栏标题
					uni.setNavigationBarTitle({
						title: this.ablumtitle.name
					})
				}
			},
			// console.log(id,status);
			// console.log(res.data);
			// console.log(res.data.playlist);
			// console.log(res.data.playlist.name); //歌单名
			// console.log(res.data.playlist.coverImgUrl); //歌单封面
			// console.log(res.data.playlist.trackCount); //歌曲数量
			// console.log(res.data.playlist.tags); //歌曲标签
			// console.log(res.data.playlist.trackIds); //所有歌曲id
			// console.log(res.data.playlist.tracks); //歌曲信息
			// console.log(res.data.playlist.tracks[0].name); //歌名
			// console.log(res.data.playlist.tracks[0].al.picUrl); //歌曲图片
			// console.log(res.data.playlist.tracks[0].al.name); //专辑名
			// console.log(res.data.playlist.tracks[0].ar[0].name); //歌手
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
			playAll() {
				if(this.status==false){
					//歌单
					// this.songlist.tracks
					uni.$emit("updeta",{songListID:this.id,status:this.status})
				}else{
					// 专辑
					// this.ablumlist
					uni.$emit("updeta",{albumID:this.id,status:this.status})
				}
			}
		},
		created() {
			// this.getsong()
		},

	}
</script>

<style>
	.songlist-albumplay {
		position: fixed;
		bottom: 0;
	}

	.songbox {
		width: 90%;
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
		width: 90%;
	}

	.ablumtitle {
		width: 90%;
		background-color: #fff;
		margin: 50rpx 0;
	}

	.ablumtitle text:first-child {
		font-size: 40rpx;
		font-weight: bold;
		color: #000;
	}

	.ablumtitle text:last-child {
		font-size: 15rpx;
		color: #999;
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

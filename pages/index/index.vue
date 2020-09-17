<template>
	<view class="index">
		<!-- 顶部搜索框 -->
		<view class="inputbox">
			<view class="input" @click="goSerch">
				搜索热门的心情电台
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="banner">
			<swiper circular="true" show-scrollbar="false" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,i) of banners" :key="i">
					<view class="swiper-item">
						<image :src="item" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 最新专辑 -->
		<view class="recommends sort">
			<view class="sort-title">
				<text>最新专辑</text>
				<text>更多</text>
			</view>
			<scroll-view scroll-x="true">
				<view class="recommends-list">
					<block v-for="(item,i) of recommends" :key="i">
						<my-alnum :name="item.name" :id="item.id" :page_img="item.picUrl" :chanteur="item.artist.name" :total_songs="item.trackCount"></my-alnum>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 推荐歌单 -->
		<view class="recommends sort">
			<view class="sort-title">
				<text>推荐歌单</text>
				<text>更多</text>
			</view>
			<scroll-view scroll-x="true">
				<view class="recommends-list">
					<block v-for="(item,i) of playlist" :key="i">
						<my-alnum :name="item.name" :id="item.id" :page_img="item.picUrl" :total_songs="item.trackCount"></my-alnum>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 推荐歌手 -->
		<view class="recommends sort">
			<view class="sort-title">
				<text>推荐歌手</text>
				<text>更多</text>
			</view>
			<scroll-view scroll-x="true">
				<view class="recommends-list">
					<block v-for="(item,i) of singers" :key="i">
						<my-live-band :SingerAvatar="item.picUrl" :LeighNash="item.name" :collectNum="item.collectNum" :singerId="item.id"></my-live-band>
					</block>
				</view>
			</scroll-view>
		</view>
		<AlbumPlay class="index-albumplay"></AlbumPlay>
		<my-tabbar active="首页"></my-tabbar>
	</view>
</template>

<script>
	import myAlnum from "../../myComponents/my-alnum/myAlnum.vue"
	import mySonglist from "../../myComponents/my-songlist/mySongList.vue"
	import myTabbar from "../../myComponents/my-tabbar/myTabbar.vue"
	import myLiveBand from "../../myComponents/my-LiveBand/myLiveBand.vue"
	export default {
		components: {
			myAlnum,
			mySonglist,
			myTabbar,
			myLiveBand
		},
		data() {
			return {
				banners: [
					"https://img01.dmhmusic.com/0412/M00/45/00/ChAKEl9gUk6AGUghAAC4zOF9VSg068.jpg",
					"https://img01.dmhmusic.com/0412/M00/38/F6/ChAKEV9Zj1eAazleAAFWnyxhRds297.jpg",
					"https://img01.dmhmusic.com/0412/M00/38/F5/ChAKEl9Zj66AH5NKAAEHwHRzy5k941.jpg",
					"https://img01.dmhmusic.com/0412/M00/38/F6/ChAKEl9ZkCOAci22AADHQVMItxk976.jpg",
					"https://img01.dmhmusic.com/0412/M00/39/37/ChAKEV9ZyKqAZ5xUAADNTfTOrus295.jpg",
					"https://img01.dmhmusic.com/0412/M00/3A/0D/ChAKEl9a4xaAFifkAAFoHSQ3Otc875.jpg",
					"https://img01.dmhmusic.com/0412/M00/3A/0E/ChAKEV9a43CAZVQPAACv9HNmpto558.jpg",
					"https://img01.dmhmusic.com/0412/M00/44/B1/ChAKEl9gJ3qAV6icAAHLgPaRlDE654.jpg"
				],
				// 推荐专辑
				recommends: [],
				// 推荐歌单
				playlist: [],
				// 推荐歌手
				singers: []
			}
		},
		methods: {
			// 封装请求方法
			getMsg({
				url,
				method = "get",
				data
			}) {
				return this.$myReq({
					url,
					method,
					data,
				})
			},
			// 跳转搜索页面的事件
			goSerch() {
				uni.navigateTo({
					url: "/pages/SearchPage/SearchPage",
					animationType: "zoom-fade-out"
				})
			}
		},
		mounted() {
			// 请求最新专辑数据
			this.getMsg({
				url: "album/newest"
			}).then(res => {
				res.data.albums.forEach(({
					id,
					name,
					picUrl,
					trackCount,
					artist
				}) => {
					let obj = {
						id,
						name,
						picUrl: picUrl + "?imageView=1&type=webp&thumbnail=369x0",
						artist,
						trackCount
					}
					this.recommends.push(obj)
				})
			})
			// 请求推荐专辑数据
			this.getMsg({
				url: "personalized",
				data: {
					limit: 10
				}
			}).then(res => {
				res.data.result.forEach(({
					id,
					name,
					picUrl,
					trackCount,
				}) => {
					let obj = {
						id,
						name,
						picUrl: picUrl + "?imageView=1&type=webp&thumbnail=369x0",
						trackCount
					}
					this.playlist.push(obj)
				})
			})
			// 请求推荐歌手数据
			this.getMsg({
				url: "top/artists",
				data: {
					offset: 0,
					limit: 10
				}
			}).then(res => {
				console.log(res)
				res.data.artists.forEach(({id,name,picUrl})=>{
					let obj={
						id,
						name,
						picUrl:picUrl+"?imageView=1&type=webp&thumbnail=369x0",
						collectNum:Math.floor(Math.random()*200+10)
						
					}
					this.singers.push(obj)
					console.log(obj)
				})
			})
		}
	}
</script>

<style>
	view.index {
		padding-bottom: 190rpx;
	}

	view.index>view.inputbox {
		border: 1px solid gray;
		padding: 22rpx 15rpx;
		width: 80%;
		border-radius: 5rpx;
		margin: 90rpx auto 70rpx;
		border: 0;
		box-shadow: 10rpx 5rpx 30rpx #C0C0C0;
	}

	view.index>view.inputbox>view.input {
		font-size: 25rpx;
		color: #aaa;
		display: flex;
		align-items: center;
	}

	view.index>view.inputbox>view.input::before {
		content: '';
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		background: url("../../static/icon/serch.png") center center no-repeat;
		background-size: cover;
		margin: 0 20rpx;
	}

	view.banner {
		padding: 0 20rpx;
		margin-bottom: 70rpx
	}

	view.banner image {
		width: 100%;
		border-radius: 10rpx;
	}

	view.sort {
		padding: 0 55rpx;
		margin-bottom: 70rpx;
	}

	view.sort-title {
		display: flex;
		justify-content: space-between;
		color: #333;
		align-items: center;
		margin-bottom: 20rpx;
	}

	view.sort-title>text:first-child {
		font-weight: 700;
		font-size: 40rpx;
		letter-spacing: 3;
	}

	view.sort-title>text:last-child {
		font-size: 30rpx;
		color: #666;
	}

	view.recommends view.recommends-list {
		display: flex;
		float: left;
	}

	view.index view.index-albumplay {
		position: fixed;
		bottom: 110rpx;
		left: 0;
		z-index: 100;
	}
</style>

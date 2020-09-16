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
			<swiper circular="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,i) of banners" :key="i">
					<view class="swiper-item">
						<image :src="item" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 最新专辑与推荐歌单 -->
		<view class="	">
			
		</view>
		<my-tabbar active="首页"></my-tabbar>
		<AlbumPlay></AlbumPlay>
	</view>
</template>

<script>
	import myAlnum from "../../myComponents/my-alnum/myAlnum.vue"
	import mySonglist from "../../myComponents/my-songlist/mySongList.vue"
	import myTabbar from "../../myComponents/my-tabbar/myTabbar.vue"

	export default {
		components: {
			myAlnum,
			mySonglist,
			myTabbar
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
				// 推荐歌单与专辑
				recommends:[]
			}
		},
		methods: {
			// 封装请求方法
			 getMsg({url,method="get",data}) {
				return  this.$myReq({
					url,
					method,
					data,
				})
			},
			// 跳转搜索页面的事件
			goSerch() {
				uni.navigateTo({
					url: "/pages/mine/mine",
					animationType: "zoom-fade-out"
				})
			}
		},
		mounted() {
			// 请求数据
			this.getMsg({url:"album/newest"}).then(res=>{
				this.recommends.push(res.data.albums)
				console.log(res)
			})
			this.getMsg({url:"personalized",data:{limit:10}}).then(res=>{
				this.recommends.push(res.data.result)
				console.log(this.recommends)
			})
		}
	}
</script>

<style>
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
	view.banner{
		padding: 0 20rpx;
	}
	
	view.banner image{
		width: 100%;
		border-radius: 10rpx;
	}
	
</style>

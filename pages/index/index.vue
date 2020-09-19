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
						<my-alnum :name="item.name" :id="item.id" :page_img="item.picUrl" :chanteur="item.artist.name" :total_songs="item.trackCount"
						 @sendAlnumId="sendAlnumId"></my-alnum>
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
						<my-alnum :name="item.name" :id="item.id" :page_img="item.picUrl" :total_songs="item.trackCount" @sendAlnumId="sendAlnumId"></my-alnum>
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
		<!-- 推荐歌曲 -->
		<view class="recommends sort">
			<view class="sort-title">
				<text>新歌推荐</text>
				<text>更多</text>
			</view>
			<scroll-view scroll-x="true">
				<view class="song">
					<view v-for="(arritem,i) of newestSong" :key="i">
						<block v-for="(item,key) of arritem" :key="key">
							<my-songlist :sid="item.id" :sname="item.name" :alnumName="item.alnumName" :sing_img="item.picUrl" @click.native="sendSongID({songid:item.id})">
								<view class="songlist_play">
									<image src="../../static/icon/play.png" mode="widthFix"></image>
								</view>
							</my-songlist>
						</block>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 分类显示 -->
		<block v-for="(classify,i) of sortSong" :key="i">
			<view class="recommends sort">
				<view class="sort-title">
					<text>{{classify.cat}}</text>
					<text>更多</text>
				</view>
				<scroll-view scroll-x="true">
					<view class="recommends-list">
						<block v-for="(item,key) of classify.playlists" :key="key">
							<my-alnum :name="item.name" :id="item.id" :page_img="item.coverImgUrl" :total_songs="item.trackCount"
							 @sendAlnumId="sendAlnumId"></my-alnum>
						</block>
					</view>
				</scroll-view>
			</view>
		</block>
		<AlbumPlay class="index-albumplay"></AlbumPlay>
		<my-tabbar active="首页"></my-tabbar>
	</view>
</template>

<script>
	import myAlnum from "../../myComponents/my-alnum/myAlnum.vue"
	import mySonglist from "../../myComponents/my-songlist/mySongList.vue"
	import myTabbar from "../../myComponents/my-tabbar/myTabbar.vue"
	import myLiveBand from "../../myComponents/my-LiveBand/myLiveBand.vue"
	import {
		mapMutations
	} from 'vuex'
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
				singers: [],
				// 最新歌曲
				newestSong: [],
				// 分类歌单
				sortSong: []
			}
		},
		methods: {
			...mapMutations(["setonPlayList"]),
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
			promise() {
				return new Promise((resolve) => {
					uni.request({
						url: "http://localhost:3000/playlist/catlist",
						method: "get",
						success: (res) => {
							let sub = [];
							let length = res.data.sub.length;
							for (let i = 0;; i++) {
								if (sub.length === 3) {
									break;
								}
								let index = Math.floor(Math.random() * length);
								if (sub.indexOf(res.data.sub[index] == -1)) {
									sub.push(res.data.sub[index])
								}
							}
							resolve(sub)
						}
					})
				})
			},
			// 跳转搜索页面的事件
			goSerch() {
				uni.navigateTo({
					url: "/pages/SearchPage/SearchPage",
					animationType: "zoom-fade-out"
				})
			},
			// 歌单专辑自定义事件处理函数，用来传递参数到click-to-play组件
			// 形参
			sendAlnumId(alnumId) {
				uni.$emit("updeta", alnumId)
			},
			// 首页歌曲点击事件处理函数，用来传递参数到click-to-play组件
			sendSongID(songID) {
				// 将数组扁平化的函数
				function flatArray(arr) {
					return arr.reduce((result, value) => {
						return result.concat(Array.isArray(value) ? flatArray(value) : value)
					}, [])
				}
				// 将首页歌曲的数组 替换到vuex中的播放列表页数组
				 this.setonPlayList(flatArray(this.newestSong))
				// 将当前点击的歌曲id传递到click-to-play组件
				uni.$emit("updeta", songID)
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
				// console.log(res)
				res.data.artists.forEach(({
					id,
					name,
					picUrl
				}) => {
					let obj = {
						id,
						name,
						picUrl: picUrl + "?imageView=1&type=webp&thumbnail=369x0",
						collectNum: Math.floor(Math.random() * 200 + 10)

					}
					this.singers.push(obj)
				})
			})
			// 请求歌曲数据
			this.getMsg({
				url: "personalized/newsong"
			}).then(res => {
				// 数据处理	
				// 将返回的数组转为二维数组方便渲染


				// 声明一个空数组
				let arr = []
				// 循环
				res.data.result.forEach(({
					id,
					name,
					picUrl,
					song
				}, i) => {
					let obj = {
						id,
						name,
						picUrl: picUrl + "?imageView=1&type=webp&thumbnail=369x0",
						alnumName: song.album.name
					}
					// 将对象压入空数组
					arr.push(obj)
					// 判断
					// 判断当前元素下标+1 %3 是否等于0 || i是否为最后一个下标 
					if (!((i + 1) % 3) || i == res.data.result.length - 1) {
						this.newestSong.push(arr)
						arr = []
					}
				})

			})
			// 请求分类歌单
			this.promise().then(res => {

				res.forEach(item => {
					if (item.name.indexOf("&") !== -1) {
						item.replace(item.name.indexOf("&"), "%26");
					}
					this.getMsg({
						url: "top/playlist",
						data: {
							limit: 10,
							cat: item.name
						}
					}).then(res => {
						let playlists = []
						res.data.playlists.forEach(({
							name,
							id,
							coverImgUrl,
							trackCount
						}) => {
							let playinfo = {
								id,
								name,
								coverImgUrl,
								trackCount
							}
							playlists.push(playinfo)
						})
						let obj = {
							cat: res.data.cat,
							playlists,
						}
						this.sortSong.push(obj)

					})
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
		margin-bottom: 70rpx;
	}

	view.sort-title {
		padding: 0 55rpx;
		display: flex;
		justify-content: space-between;
		color: #333;
		align-items: center;
		margin-bottom: 30rpx;
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
		float: left;
		display: flex;
	}

	view.recommends view.recommends-list view.album:first-child,
	view.recommends view.recommends-list view.Live-Band:first-child {
		margin-left: 55rpx;
	}

	view.index view.index-albumplay {
		position: fixed;
		bottom: 110rpx;
		left: 0;
		z-index: 100;
	}

	view.recommends view.song {
		display: flex;
		float: left;
		padding-right: 20rpx;
	}

	view.recommends view.song>view:first-child {
		padding-left: 40rpx;
	}

	view.recommends view.song view.songlist {

		width: 600rpx;
	}

	view.recommends view.song view.songlist_play {
		width: 80rpx;
	}

	view.recommends view.song view.songlist_play image {
		width: 70%;
	}
</style>

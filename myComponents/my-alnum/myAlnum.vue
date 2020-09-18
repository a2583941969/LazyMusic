<template>
	<view class="album">
		<view @click="goto" hover-class="none" animation-type="none">
			<view>
				<image :src="page_img" mode="widthFix"></image>
				<view class="btn" @click.stop="playThisAlnum">
				</view>
			</view>
			<view class="album_info">
				<text class="title">{{name}}</text>
				<text class="author">{{total_songs?total_songs+'首单曲':chanteur}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		//  name       歌单/专辑名称 
		//  page_img   封面图
		//  chanteur   歌手       
		//  total_songs歌曲总数      
		//  id         当前歌单/专辑的id   
		//  bool       显示专辑或歌单的bool值
		props: ["name", "page_img", "chanteur", "total_songs", "id"],
		data() {
			return {

			};
		},
		methods: {
			// 点击播放本歌单的函数
			playThisAlnum() {
				// 判断是专辑还是歌单
				// ture为歌单  false为专辑
				let isAlnum=this.total_songs?false:true;
				
				this.$emit("sendAlnumId",{id:this.id,isAlnum})
			},
			goto() {
				let bool=false
				if(this.total_songs){
					bool=true
				}
				
				uni.navigateTo({
					url: "/pages/songlist/songlist?id="+this.id+"&status="+bool,
					animationType: "none"
				})
			}
		}
	}
</script>

<style>
	view.album {
		width: 300rpx;
		margin-right: 20rpx;
	}

	view.album>view>view {
		width: 100%;
	}

	view.album>view image {
		width: 100%;
	}

	view.album view {
		position: relative;
	}

	view.album>view>view>view.btn {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background: url('../../static/icon/play-filled.png') center center no-repeat;
		background-size: cover;
		z-index: 20;
	}

	view.album>view>view.album_info {
		display: flex;
		margin-top: 24rpx;
		flex-direction: column;
	}

	view.album>view>view.album_info>text.title {
		font-size: 28rpx;
		font-weight: 900;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	view.album>view>view.album_info>text.author {
		font-size: 24rpx;
		color: #666;
		margin-top: 12rpx;
	}
</style>

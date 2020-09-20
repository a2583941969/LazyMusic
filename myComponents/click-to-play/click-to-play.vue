<template>

		<view class="bottomBox" @click="toSong">
			<!-- 音乐图片 -->
			<view class="albumAvatar">
				<image :src="albumPicUrl"></image>
			</view>
			<!-- 音乐名字 -->
			<view class="song" v-if="this.store.state.audioEle">
				<view class="songName">
					<text class="songNameItem">{{this.store.state.songName}}</text>
				</view>
				
				<text>/</text>
				
				<text class="singer">{{this.store.state.singer}}</text>
			</view>
			<view v-else class="song">
				<text>美好的一天，从音乐开始哦</text>
			</view>
			<!-- 音乐按钮 -->
			<view class="albumPlay">
				<!-- 阻止事件冒泡，点击对应按钮，开始不同的操作 -->
				<image :src="this.$store.state.musicOn?'../../static/icon/pause.png':'../../static/icon/play.png'" mode="" @click.stop="playMusic"></image>
				<image src="../../static/icon/skip-forward-filled.png" mode="" @click.stop="playNext"></image>
			</view>
		</view>

</template>

<script>
	export default {
		//     专辑/音乐图片     专辑名字，作者名字，  歌曲长度     歌曲名字
		// props: ["AlbumImg", "AlbumName", "singer",songLength，songName],
		data() {
			return {
				id:'',
				albumPicUrl:''		
			}
		},
		created() {
			uni.$on('updeta',(params)=>{
				console.log(params)
				//如果当前是一首歌
				if(params.songid){
					this.id = params.songid;
					// 获取歌曲的音频地址
					this.getSong(params.songid);
					//获取歌曲的详细信息
					this.getSongDetail(params.songid);
				}
			})
		},
		mounted() {
			//当获取传过来的参数时，就实例化音频对象，并保存到vuex中
			
		},
		methods: {
			//请求歌曲的详细信息，并实例化
		 async getSong(sid){
				let res = await this.$myReq({
					url:'song/url?id=' + sid,
					method:'GET'
				});
				// console.log(res)
				let {url} =res.data.data[0];
				
				if(this.store.state.audioEle==""){
				//实例化音频对象，存放进vuex
				this.store.commit('setAudioEle',uni.createInnerAudioContext());
				//将实例化的音频对象调出
				let {audioEle} =this.store.state;
				// 将音频的url 绑定在 实例化对象上
				audioEle.src= url;
				//默认开启循环，后期放入vuex，根据用户的操作改变
				audioEle.loop=true;
				//点击后就应该立即播放
				audioEle.autoplay=true;
				//若这个歌曲可以播放的话，就获取音乐的长度，放入store状态管理
				audioEle.onCanplay(()=>{
					this.store.commit('setSongLen',audioEle.duration)
				});
				audioEle.onTimeUpdate(() => {
					//获取当前的播放时间，存到vuex中
					// this.currentTime = audioEle.currentTime;
					this.store.commit('setCurrentTime', audioEle.currentTime)
				});
				// 当音乐播放的时候,就把音乐的状态改变成在播放
				audioEle.onPlay(() => {
					this.store.commit('setMusicOn', true);
				});
				// 当音乐暂停的时候，音乐的状态改变成没有在播放
				audioEle.onPause(() => {
					this.store.commit('setMusicOn', false)
				});
				}else{
					//将实例化的音频对象调出
					let {audioEle} =this.store.state;
					//替换实例化的路径
					audioEle.src=url
				}
			},
			async getSongDetail(sid){
				let res = await this.$myReq({
					url:'song/detail?ids='+sid,
					method:'GET'
				});		 
			//获取歌曲的名字
			let Name = res.data.songs[0];
			this.store.commit('setSongName',Name.name)
			//获取歌手的名字，如果歌手不存在，就默认为佚名
			if(Name.ar[0].name){
			this.store.commit('setSinger',Name.ar[0].name);
			//获取专辑的名字
			this.store.commit('setAlbumName',Name.al.name);
			//获取专辑的图片
			this.albumPicUrl = Name.al.picUrl +"?imageView=1&type=webp&thumbnail=50x0"
			}
			},
			//点击底部音乐栏就去歌曲单页
		toSong(){
			uni.navigateTo({
				url:`../../pages/song/song?albumPic=${this.albumPicUrl}&id=${this.id}`
			});
		},
		playMusic(){
			let {audioEle} =this.store.state;
			if (this.store.state.musicOn) {
				audioEle.pause();
			} else {
				// 否则就让他播放
				audioEle.play();
			}
		},
		playNext(){
			console.log("播放下一首音乐")
		}
		}
	}
</script>

<style>

	.bottomBox {
		flex-direction: row;
		justify-content: end;
		box-shadow: 0rpx -1rpx 15rpx 1rpx #DDDDDD;
		background-color: white;
		width: 750rpx;
		height: 80rpx;
		position: relative;

	}

	.albumAvatar {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		top: -30rpx;
		left: 30rpx;
		z-index: 2;
		border-radius: 50%;
		background-color: #D3D3D3;
		
	}

	.albumAvatar>image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.albumPlay {
		display: inline-block;
		flex: 2;
		padding-top: 20rpx;
		position: absolute;
		right: 30rpx;
	}

	.albumPlay>image {
		width: 40rpx;
		height: 40rpx;
	}

	.albumPlay>image:last-child {
		margin-left: 40rpx;
	}

	.song {
		display: flex;
		color: black;
		margin: 0rpx 0rpx 0rpx 180rpx;
		font-size: 25rpx;
		padding-top: 10rpx;
		position: absolute;
		width: 58%;
		height: 55rpx;
		overflow: hidden;
		justify-content: center;
		align-items: center;
	}
	.song>text:nth-child(2){
		margin: 0 10rpx;
	}
	@keyframes songNameScroll{
		0%{
			transform: translateX(0);
		}
		100%{
			transform: translateX(-100%);
		}
	}
	.song>.songName{
		overflow: hidden;
		white-space: nowrap;
	}
	.songName .songNameItem {
		display: inline-block;
		padding-left:20rpx ;
		animation: songNameScroll 5s linear infinite ;
	}
	.song>.singer{
		width: 50%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>

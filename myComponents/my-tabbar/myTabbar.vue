<template>
	<view class="tabbar">
		<view v-for="(item,i) of tabBar" :key="i" class="tabbar-item" @click="goTo($event,item.url)"  hover-class="none">
			<image :src="act==item.text?item.selectedIcon:item.unSelectedIcon" mode="widthFix"></image>
			<text :class="act==item.text?'active':''">{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:["active"],
		data() {
			return {
				tabBar: [{
						url: "/pages/index/index",
						selectedIcon: "../../static/icon/homeselect.png",
						unSelectedIcon: "../../static/icon/home.png",
						text: "首页"
					},
					{
						url: "/pages/mine/mine",
						selectedIcon: "../../static/icon/mineselect.png",
						unSelectedIcon: "../../static/icon/mine.png",
						text: "我的"
					}
				],
				act:this.active
			}
		},
		methods:{
			goTo(e,url){
				uni.navigateTo({
					url,
					animationType:"none"
				})
			}
		},
		mounted(){
		}
	}
</script>

<style>
	view.tabbar {
		width: 750rpx;
		height: 110rpx;
		box-sizing: border-box;
		border-top: 1px solid #ccc;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		z-index: 100;
	}

	view.tabbar>view.tabbar-item {
		padding: 10rpx 0;
		text-align: center;
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: center;
		font-size: 26rpx;
		color: #999;
	}
view.tabbar>view.tabbar-item >text.active{
	color: #333;
}
	view.tabbar>view.tabbar-item>image {
		width: 55rpx;
	}
</style>

<template>
	<view class="mine">
		<view class="header">
			<view>
				<image src="../../static/icon/setting.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="main">
			<view class="avatar">
				<image src="../../static/icon/mine.png" mode=""></image>
			</view>
			<view class="login">
				
			</view>
		</view>
		<my-tabbar active="我的"></my-tabbar>
	</view>
</template>

<script>
	import myTabbar from "../../myComponents/my-tabbar/myTabbar.vue"
	export default {
		components: {
			myTabbar
		},
		data() {
			return {
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
view.mine>view.header{
	width: 100%;
	padding-top: 90rpx;
}
view.mine>view.header::after{
	content: '';
	display: block;
	clear: both;
}
view.mine>view.header>view{
	margin-right: 35rpx;
	float: right;
	width: 100rpx;
	height: 100rpx;
}
view.mine>view.header>view image{	
	width: 70%;
	height: 70%;
} 
</style>

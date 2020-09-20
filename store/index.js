import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	musicOn:false,
	audioEle:'',
	songLength:0,
	currentTime:0,
	// 正在的播放的歌曲所在列表
	onPlayList:[],
	singer:'',
	songName:'',
	albumName:''
  },
  mutations: {
		// 查看是否正在播放音乐
		setMusicOn(state,musicOn){
			state.musicOn = musicOn
		},
		setAudioEle(state,audioEle){
			state.audioEle=audioEle;
		},
		setSongLen(state,songLength){
			state.songLength = songLength
		},
		setCurrentTime(state,currentTime){
			state.currentTime =currentTime
		},
		setonPlayList(state,onPlayList){
			state.onPlayList=onPlayList
		},
		setSinger(state,singer){
			state.singer = singer
		},
		setSongName(state,songName){
			state.songName = songName
		},
		setAlbumName(state,albumName){
			state.albumName = albumName
		}
  },
  actions: {
  },
  modules: {
		
  }
})

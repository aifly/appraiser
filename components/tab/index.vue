<template>
	<div class="wm-tab-ui lt-full">
		<div class="wm-tab-bar" :class="{'hide':hideTab}">
			<div class="wm-tab-title">{{title}}</div>
			<slot  name='wm-tab-menu'></slot>
			<div class="wm-tab-btn" @click='toggleTab' v-if='false'>
				<img style='transform: rotate(180deg)' v-if='hideTab' :src="imgs.open">
				<img v-if='!hideTab' :src="imgs.open">
			</div>
		</div>
		<div class="wm-tab-content" :style="{width:width+'px'}">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';

	import $ from 'jquery';

	export default {
		props:['title','tabs','tabIndex'],
		name:'zmitiindex',
		data(){
			return{
				theme2:"light",
				imgs:window.imgs,
				viewW:document.documentElement.clientWidth,
				hideTab:false,
				width:0
			}
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		
		methods:{
			toggleTab(){
			/* 	this.hideTab = !this.hideTab;
				this.resizeTab(); */
			},
			resizeTab(){
				this.width = window.innerWidth-50-(this.hideTab?0:200)
			}
		},
		mounted(){
			this.resizeTab()
			
			$(window).on('resize',()=>{
				this.resizeTab()
			})
		}
	}
</script>
 
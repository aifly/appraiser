<template>
	<ul class="wm-tab-list">
		<li :class="{'active':$route.name === 'user'}"><router-link to='/user'><Icon type="person"></Icon>账户资料</router-link></li>
		<li :class="{'active':$route.name === 'score'}"><router-link to='/score'><Icon type="person"></Icon>我的评分</router-link></li>
		<li :class="{'active':$route.name === 'history'}"><router-link to='/history'><Icon type="person"></Icon>历史评分</router-link></li>
	</ul>
</template>

<script>
	import './index.css';
	import $ from 'jquery';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				index:0
			}
		},
		components:{
		},
		
		methods:{
			

		},
		mounted(){
 			console.log(this.$route.params.id )
		}
	}
</script>
 
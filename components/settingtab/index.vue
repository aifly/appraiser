<template>
	<ul class="wm-tab-list">
		<li v-if='false' :class="{'active':$route.name === 'adminuser'}"><router-link to='/adminuser'><Icon type="person"></Icon>人员管理</router-link></li>
		<li :class="{'active':$route.name === 'periods'}"><router-link to='/periods'><Icon type="person"></Icon>考评管理</router-link></li>
		<li  v-if='false' :class="{'active':$route.name === 'checkitem'}"><router-link to='/checkitem'><Icon type="person"></Icon>评分项管理</router-link></li>
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
				index:0,
				
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
 
<template>
	<div class="sysbin-group-ui">
		<Tab  title='个人中心' :tabs='tabs' :tabIndex='tabIndex'>
			<div slot='wm-tab-menu' v-if='$route.name==="score"||$route.name==="user" ||$route.name==="history"'>
				<UserTab></UserTab>
			</div>
		</Tab>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Tab from '../tab/index';
	import UserTab from '../usertab/index';
	import Vue from 'vue';


	export default {
		props:['obserable'],
		data(){
			return{
				tabIndex:[0,-1],
				theme2:"light",
				
				tabs:[
					{
						name:'新增栏目',
						link:'/column/add'
					},
					{
						name:'栏目列表',
						link:'/column/list'
					}
				]
			}
		},
		components:{
			Tab,
			UserTab
		},

		mounted(){

			
			switch (this.$route.name) {
				case 'user':
					
					break;
			}


			var obserable = Vue.obserable;


			obserable.on('fillTabs',(data)=>{
				this.tabs = data || [];
			});

			obserable.on('fillTabIndex',(data)=>{
				
				data[2]!==-1 && (this.tabs[data[2]].status = true);
				data.length = 2;
				this.tabIndex = data;
			})
		},

		beforeDestory(){

		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		methods:{
			tab1(index,level){

				if(level && level.length){
					console.log('this.tabs[index].status => '+this.tabs[index].status)
					this.tabs[index].status = !this.tabs[index].status;

				}else{
					this.tabIndex = [index,-1]
				}
			},
			tab2(i,k){
				this.tabIndex = [i,k];
			}
		}
	}
</script>
 
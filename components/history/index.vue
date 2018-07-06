<template>
	<div class="wm-history-ui">
		<header>
			<div>历史评分</div>
		</header>
		<div ref='list'>
			<section class="wm-history-list">
				<div v-for='(history,i) in historyList' :key='i'>
					<div class="wm-history-date">
						<span>{{history.date}}</span>第{{i+1}}期
					</div>
					<ul v-for='(role,k) in history.rolelist' :key='k'>
						<li>{{role.rolename}}</li>
						<li>
							<div :style="{width:100 / role.checkitemlist.length+'%'}">姓名</div>
							<div :style="{width:100 / role.checkitemlist.length+'%'}" v-for="(standard,h) in role.checkitemlist" :key='h'>
								{{standard.title}}
							</div>
						</li>
						<li v-for="(list,j) in role.scorelist" :key="j">
							<div :style="{width:100 / role.checkitemlist.length+'%'}" >
								<div class="wm-department-username">{{list.username}}</div>
							</div>
							<div :style="{width:100 / role.checkitemlist.length+'%'}"  v-for="(standard,h) in role.checkitemlist" :key='h'>
								{{list['score'+standard.checkitemid]}} 分
							</div>
						</li>
					</ul>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import IScroll from 'iscroll';
	import symbinUtil from '../lib/util';

	import $ from 'jquery';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				historyList:[],
				standardList:[]
			}
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');
			this.validate = validate;

		},
		
		methods:{
			getHistoryList(){
				var s = this;
				/* symbinUtil.ajax({
					url:window.config.baseUrl+"/wmuser/gethistorylist",
					validate:s.validate,
					success(data){
						
						s.historyList = data.list;
						setTimeout(() => {
							s.scroll.refresh();
						}, 100);
					}
				}) */
				
				$.getJSON('./components/data/history.json',(data)=>{
					this.historyList = data.list;
					setTimeout(() => {
						this.scroll.refresh();
					}, 100);
				});
				symbinUtil.getStandard((data)=>{
					this.standardList = data;
				})
			}
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			if(this.userinfo.isadmin){
				window.location.hash = '/periods';
				return;
			}
			this.getHistoryList();
			this.scroll = new IScroll(this.$refs['list'],{
				scrollbars:true,
				mouseWheel:true,
				preventDefault:false
			})
		}
		
	}
</script>
 
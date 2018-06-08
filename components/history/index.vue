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
					<ul v-for='(department,k) in history.departmentlist' :key='k'>
						<li>{{department.departmentname}}</li>
						<li>
							<div>姓名</div>
							<div v-for="(standard,h) in standardList" :key='h'>
								{{standard.name}}
							</div>
						</li>
						<li v-for="(list,j) in department.list" :key="j">
							<div>
								<div class="wm-department-username">{{list.name}}</div>
							</div>
							<div v-for='(score,g) in list.score' :key="g">
								{{score}} 分
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

		},
		
		methods:{
			getHistoryList(){
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
			this.getHistoryList();
			this.scroll = new IScroll(this.$refs['list'],{
				scrollbars:true,
				mouseWheel:true,
				preventDefault:false
			})
		}
		
	}
</script>
 
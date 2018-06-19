<template>
	<div class="wm-score-ui">
		<header>
			<div>我的得分</div>
		</header>
		<div ref='list'>
			<section class="wm-score-list">
				<ul v-for='(score,i) in scoreList' :key='i' class="wm-score-item">
					<li><span>{{score.date}}</span> 第{{i+1}}期</li>
					<li v-for='(standard ,k ) in standardList' :key='k'>
						<div>{{standard.title}}</div>
						<div>{{score.score[k]}} 分</div>
					</li>
					<li class="wm-avg-score">
						<div>综合评分</div>
						<div>{{score.score[score.score.length-1]<60?'不合格':score.score[score.score.length-1]<=70?'基本合格':score.score[score.score.length-1]<=89?'合格':'优秀'}} <span>{{score.score[score.score.length-1]}}分</span> </div>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import IScroll from 'iscroll'

	import $ from 'jquery';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				scoreList:[],
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
			getScoreList(){//获取我的得分列表。
				var s = this;
				symbinUtil.ajax({
					validate:s.validate,
					url:window.config.baseUrl+'/wmuser/getmyscorelist/',
					data:{},
					success(data){
						symbinUtil.getStandard((d)=>{
							s.standardList = d;
							if(data.getret === 0){
								data.list.map((dt,i)=>{
									var score = [];
									s.standardList.map((item,k)=>{
										score.push(dt.score['score'+(k+1)])
									});
									
									score.push(dt.score.avgscore);
									s.scoreList.push({
										date:dt.periodsname,
										score
									})
									setTimeout(() => {
										s.scroll.refresh();	
									}, 100);
								})
							}
						});
					}
				})

				/* $.getJSON('./components/data/score.json',(data)=>{
					//console.log(data);
					this.scoreList = data.list;

				}); */

				
				console.log(this.standardList)
			}
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			if(this.userinfo.isselect === 0){//不可被评的，没有我的得分页面。
				window.location.hash = '/user';
				return;
			}
			if(this.userinfo.isadmin){
				
				window.location.hash = '/periods';
				return;
			}
			this.getScoreList()

			this.scroll = new IScroll(this.$refs['list'],{
				scrollbars:true,
				mouseWheel:true
			});
		}
		
		
	}
</script>
 
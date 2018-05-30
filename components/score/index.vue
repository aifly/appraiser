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
						<div>{{standard.name}}</div>
						<div>{{score.score[k]}} 分</div>
					</li>
					<li class="wm-avg-score">
						<div>综合评分</div>
						<div>{{55}} 分</div>
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

		},
		methods:{
			getScoreList(){//获取我的得分列表。
				$.getJSON('/components/data/score.json',(data)=>{
					//console.log(data);
					this.scoreList = data.list;

					setTimeout(() => {
						this.scroll.refresh();	
					}, 100);
				});

				symbinUtil.getStandard((data)=>{
					this.standardList = data;
				})
				console.log(this.standardList)
			}
		},
		mounted(){
			this.getScoreList()

			this.scroll = new IScroll(this.$refs['list'],{
				scrollbars:true,
				mouseWheel:true
			});
		}
		
		
	}
</script>
 
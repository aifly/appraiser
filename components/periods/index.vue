<template>
	<div class="wm-periods-ui" :style="{height:viewH-64+'px'}">
		<section :class='{"left":entryDetail}' >
			<div class="wm-periods-left">
				<header>
					<div>考评管理</div>
					<section>
						<Button icon='plus' @click='visible = true' type='primary'>添加</Button>
					</section>
				</header>
				<div>
					<section>
						<div v-for='(periods,i) in periodsList' :key="i" class="wm-periods-item">
							<h2>
								{{periods.periodsname}} <span>第{{i+1}}期</span>
							</h2>
							<section @click="getPeriodsDetail(periods,i)">
								<div>
									考评要求
								</div>
								<div>
									<span v-for='(standard ,k) in periods.checkitem' :key="k">
										{{standard.title}}
									</span>
								</div>
							</section>
							<footer>
								<div><span>{{periods.starttime.substr(0,10)}}</span> 至 <span>{{periods.endtime.substr(0,10)}}</span></div>
								<div>
									<span class="wm-periods-del"><Icon type="android-delete"></Icon>删除</span>
									<span class="wm-periods-edit"><Icon type="edit"></Icon>编辑</span>
								</div>
							</footer>
						</div>
					</section>
				</div>
			</div>
			<div class="wm-periods-right" :style="{height:viewH-64-10+'px'}">
				<header>
					<div>
						<span @click='entryDetail = false'>返回考评管理列表</span>
					</div>
					<div>考评记录</div>
				</header>
				<div class="wm-periods-table-list">
					<div class="wm-periods-title">
						<div>
							{{title}} <span>第{{periodsIndex}}期</span>
						</div>
						<div>
							<Button type='primary' icon='social-euro' @click='exportData'> 导出</Button>
							<Input  v-model="keyword" placeholder="请输入你要查找的人员姓名" style="width:200px;" />
						</div>
					</div>
					<Table stripe :height='viewH - 64-60 - 60' ref='scorelist'  :data='dataSource' :columns='columns'></Table>
				</div>
			</div>
		</section>
		<Modal
			v-model="visible"
			:title="currentIndex!==-1?'编辑考评':'添加考评'"
			>
			<div class="wm-periods-dialog">
				<Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width='80' >
					<FormItem label="考评名称 ：">
						<Input v-model="formItem.periodsName" placeholder="考评名称"></Input>
					</FormItem>
					<FormItem label="开始时间 ：">
						<DatePicker v-model="formItem.startdate" format="yyyy-MM-dd" type="date" confirm placeholder="开始时间"  style="width:100%"></DatePicker>
					</FormItem>
					<FormItem label="结束时间 ：">
						<DatePicker v-model="formItem.enddate" format="yyyy-MM-dd" type="date" confirm placeholder="结束时间"  style="width:100%"></DatePicker>
					</FormItem>
					<FormItem label="是否可用 ：">
						<i-switch v-model="formItem.switch" size="large">
							<span slot="open">可用</span>
							<span slot="close">禁用</span>
						</i-switch>
					</FormItem>
				
				</Form>
			</div>
   		 </Modal>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';

	import $ from 'jquery';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				columns:[],
				dataSource:[],
				imgs:window.imgs,
				visible:false,
				currentIndex:-1,
				periodsList:[],
				viewH:window.innerHeight,
				scoreList:[],
				keyword:'',
				entryDetail:false,
				standardList:[],
				title:"",
				periodsIndex:1,
				formItem:{
					periodsName:'',
					switch:true,
					startdate:'',
					enddate:''
				},
				ruleValidate: {
	
					periodsName: [{
	
						required: true,
	
						message: '考评名称不能为空',
	
						trigger: 'blur'
	
					}]
				}
			}
			
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');
			this.validate = validate;
		},
		mounted(){
			this.getPeriodsList();
			
		},
		watch:{
			keyword(val){
				this.dataSource = this.defaultSource.filter((item,i)=>{
					return item.username.indexOf(val)>-1;
				});
			}
		},
		methods:{
			getPeriodsDetail(periods,i){
				this.entryDetail = true;
				this.periodsIndex = i+1;
				this.getScoreList(periods.periodsnumberid);
			},
			exportData(){
				 this.$refs.scorelist.exportCsv({
					filename: '考评结果'
				});
			},
			getPeriodsList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/getperiodsnumberlist',
					data:{

					},
					validate:s.validate,
					success(data){
						if(data.getret === 0){
							s.periodsList = data.list;
						}
					}
				});

				/* $.getJSON('./components/data/periods.json',(data)=>{
					//this.periodsList = data.list;
				}) */
			},
			getScoreList(periodsnumberid=1){
				var s = this;
				symbinUtil.getStandard((data)=>{
					//this.standardList = data;
					if(!this.columns.length){

						this.columns.push({
							title:'姓名',
							key:'username',
							align:'center'
						})
						data.map((item,i)=>{
							this.columns.push({
								title:item.title,
								key:'score'+(i+1),
								align:'center',
								sortable: true
							})
						})
						this.columns.push({
							title:'综合评分',
							key:"avgscore",
							align:'center',
							sortable: true
						})
					}
				});
				 

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getalluserscore/',
					validate:s.validate,
					data:{
						periodsnumberid
					},
					success(data){
						s.dataSource = data.list[0].user;
						s.defaultSource = s.dataSource.concat([]);
						s.title = data.list[0].periodsname
						console.log(data);
					}
				})
			}
		}
	}
</script>
 
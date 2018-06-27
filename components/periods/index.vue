<template>
	<div class="wm-periods-ui" :style="{height:viewH-64+'px'}">
		<section :class='{"left":entryDetail,"left1":entryDetail1}' >
			<div class="wm-periods-left">
				<header>
					<div>考评管理</div>
					<section>
						<Button icon='plus' @click='open' type='primary'>添加</Button>
					</section>
				</header>
				<div>
					<section>
						<div v-for='(periods,i) in periodsList' :key="i" class="wm-periods-item">
							<div>
								<h2>
									<div>{{periods.periodsname}} <span>第{{i+1}}期</span></div>
									<div title='评分规则管理'><img :src="imgs.ruleIco" alt=""></div>
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
							</div>
							<footer>
								<div><span>{{periods.starttime}}</span> 至 <span>{{periods.endtime}}</span></div>
								<div>
									<span class="wm-periods-del" @click='deletePeriods(periods.periodsid)'><Icon type="android-delete"></Icon>删除</span>
									<span class="wm-periods-edit" @click="edit(periods,i)"><Icon type="edit"></Icon>编辑</span>
								</div>
							</footer>
						</div>
					</section>
				</div>
			</div>

			<div class="wm-periods-rule" hidden :style="{height:viewH-64-10+'px'}">
				<header>
					<div>
						<span @click='entryDetail = false'>返回考评管理列表</span>
					</div>
					<div>考评规则管理</div>
				</header>
				
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
					<Table @on-row-click='entryDetailPage' :loading='loading' stripe :height='viewH - 64-60 - 60' ref='scorelist'  :data='dataSource' :columns='columns'></Table>
				</div>
			</div>
			<div class="wm-periods-right-detail" :style="{height:viewH-64-10+'px'}">
				<header>
					<div>
						<span @click='backToDetail'>返回考评详情</span>
					</div>
				</header>
				
				<div class="wm-periods-not-list">
					<header>
                        <div class="zmiti-periods-not-header"><span style="color:#f00;font-size:16px;">{{periodsUserName}}</span> 的得分详情

						</div>
                        <div class="zmiti-periods-not-header-item">
							<Checkbox label="twitter" v-model="isNoScore" @on-change='filterScore'>
								<span>看未评的</span>
							</Checkbox>
							<div  v-for='(score,i) in　noscorelist' :key="i">{{score.rolename}}: {{score.num}} 
							</div>
							<div>未评</div>
                        </div>
                    </header>
					<Table :height='viewH - 64-60-62' stripe :data='dataSource1' :columns='columns1'></Table>
				</div>
			</div>
		</section>
		<Modal
			v-model="visible"
			:title="currentIndex!==-1?'编辑考评':'添加考评'"
			@on-ok='periodsAction'
			>
			<div class="wm-periods-dialog">
				<Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width='80' >
					<FormItem label="考评名称 ：">
						<Input v-model="formItem.periodsname" placeholder="考评名称"></Input>
					</FormItem>
					<FormItem label="开始时间 ：">
						<DatePicker v-model="formItem.starttime" format="yyyy-MM-dd" type="date" confirm placeholder="开始时间"  style="width:100%"></DatePicker>
					</FormItem>
					<FormItem label="结束时间 ：">
						<DatePicker v-model="formItem.endtime" format="yyyy-MM-dd" type="date" confirm placeholder="结束时间"  style="width:100%"></DatePicker>
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
				columns1:[],
				dataSource:[],
				dataSource1:[],
				noscorelist:[],
				imgs:window.imgs,
				visible:false,
				loading:true,
				currentIndex:-1,
				periodsList:[],
				viewH:window.innerHeight,
				scoreList:[],
				keyword:'',
				entryDetail:false,
				isNoScore:false,
				entryDetail1:false,

				standardList:[],
				title:"",
				periodsIndex:1,
				periodsnumberid:-1,//当前的考评期数
				periodsUserName:'',
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
			this.getRoleList();
			
		},
		watch:{
			keyword(val){
				this.dataSource = this.defaultSource.filter((item,i)=>{
					return item.username.indexOf(val)>-1;
				});
			}
		},
		methods:{
			open(){//新增考评。
				this.formItem = {};
				this.currentIndex = -1;
				this.visible = true;
			},
			deletePeriods(periodsid){
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/delperiodsnumber/',
					validate:s.validate,
					data:{
						periodsnumberid:2
					},
					success(data){
						console.log(data);
					}
				})
			} ,
			periodsAction(){
				var s = this;
				if(this.currentIndex>-1){//编辑
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/editperiodsnumber/',
						validate:s.validate,
						data:{
							periodsnumberid:s.periodsnumberid,

							periodsname:s.formItem.periodsname
						},
						success(data){
							console.log(data);
						}
					})
				}
				else{
					console.log(s.formItem);
					s.formItem.starttime = '2018-06-12';
					s.formItem.endtime = '2018-06-27';
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/addperiodsnumber/',
						validate:s.validate,
						data:s.formItem,
						success(data){
							console.log(data);
						}
					})
				}

			},
			edit(periods,index){
				this.currentIndex = index;
				console.log(periods)
				this.formItem = periods;
				this.visible = true;
			},
			filterScore(e){
				///console.log(e);
				var s = this;
				if(e){
					s.dataSource1 = s.defaultSource1.filter((item,i)=>{
						return item.score1 === 0 || item.score2 === 0||item.score3 === 0||item.score4 === 0||item.score5 === 0||item.score6 === 0
					});
				}
				else{
					s.dataSource1 = s.defaultSource1.concat([]);
				}
			},
			entryDetailPage(e){
				var s = this;
				s.entryDetail1 = true;
				s.entryDetail = false;
				s.periodsUserName = e.username;
				s.getEmployeescoreList(e.userid);
			},
			backToDetail(){
				this.entryDetail = true;
				this.entryDetail1 =false;
			},
			getPeriodsDetail(periods,i){
				this.entryDetail = true;
				this.periodsIndex = i+1;
				this.getScoreList(periods.periodsnumberid);

				this.periodsnumberid = periods.periodsnumberid;
			},
			exportData(){
				 this.$refs.scorelist.exportCsv({
					filename: '考评结果'
				});
			},
			getPeriodsList(){
				var s = this;
				window.s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/getperiodsnumberlist',
					data:{

					},
					validate:s.validate,
					success(data){
						if(data.getret === 0){
							data.list.forEach((item,i)=>{
								item.starttime = item.starttime.substr(0,10);
								item.starttime1 = item.starttime;
								item.endtime = item.endtime.substr(0,10);
								item.endtime1 = item.endtime;
							})
							s.periodsList = data.list;
							s.loading = false;
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
							align:'center',
							render:(h,params)=>{
								return h('div',[
									h('span',{},params.row.username),
									h('a',{
										props:{
											href:"#",
											title:"11111111"
										},
										on:{
											click(e){
												

												
											}
										},
										style:{
											position:'absolute',
											top:'14px',
											right:0,
											fontSize:'14px',
											fontWeight:"bold"
										}
									},params.row.activenum+'/'+params.row.totalnum)
								]);
							}
						})
						this.columns1[0] =  {
							key:"username",
							title:'姓名',
							align:'center'
						};
						data.map((item,i)=>{
							this.columns.push({
								title:item.title,
								key:'score'+(i+1),
								align:'center',
								sortable: true
							})

							this.columns1.push({
								title:item.title,
								key:'score'+(i+1),
								align:'center',
								sortable: true,
								render:(h,params)=>{
									return h('div',{
										style:{
											color:params.row['score'+(i+1)] === 0 ? '#f00' : '#000'
										}
									},params.row['score'+(i+1)] === 0 ?'未评':params.row['score'+(i+1)])
								}
							})
						})
						this.columns.push({
							title:'综合评分',
							key:"avgscore",
							align:'center',
							sortable: true,
							render: (h, params) => {
								var text = params.row.avgscore<60?'不合格':params.row.avgscore<=70?'基本合格':params.row.avgscore<=89?'合格':'优秀';
								//text+= ' '+ params.row.avgscore + '分'
								return h('div',[
									h('span',{
											style:{
											color:params.row.avgscore<60?'#f00':params.row.avgscore<=70?'#00f':params.row.avgscore<=89?'#000':'green',
											fontWeight:'bold',
											fontSize:'14px',

										}
									},text),
									h('span',{
											style:{
											color:params.row.avgscore<60?'#f00':params.row.avgscore<=70?'#00f':params.row.avgscore<=89?'#000':'green',
											fontWeight:'bold',
											marginLeft:'10px'

										}
									},params.row.avgscore+'分')
								]);
								}
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
					}
				})
			},
			getEmployeescoreList(userid=''){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getemployeescorelist/',
					validate:s.validate,
					data:{
						userid,
						periodsnumberid:s.periodsnumberid
					},
					success(data){
						if(data.getret === 0){
							var arr = [];
							data.list.userlist.forEach((item,i)=>{
								arr.push(item.items);
							});
							s.noscorelist = data.list.noscorelist;
							console.log(s.columns)
							s.dataSource1 = data.list.userlist;
							s.defaultSource1 = s.dataSource1.concat([]);
						}
						console.log(data);
					}
				})
			},
			getRoleList(){
				var  s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl + '/wmadmin/getRoleList',
					validate:s.validate,
					data:{},
					success(data){
						console.log(data);
					}
				})
			}
		}
	}
</script>
 
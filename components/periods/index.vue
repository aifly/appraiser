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
									<div title='评分规则管理' @click='openRulePage(periods,i)'><img :src="imgs.ruleIco" alt=""></div>
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
								<div><span>{{new Date(periods.starttime).toLocaleDateString()}}</span> 至 <span>{{new Date(periods.endtime).toLocaleDateString()}}</span></div>
								<div>
									<span class="wm-periods-del" @click='deletePeriods(periods)'><Icon type="android-delete"></Icon>删除</span>
									<span class="wm-periods-edit" @click="edit(periods,i)"><Icon type="edit"></Icon>编辑</span>
								</div>
							</footer>
						</div>
					</section>
				</div>
			</div>

			<div class="wm-periods-rule" :class="{'active':showRulePage}" :style="{height:viewH-64-10+'px'}">
				<header>
					<div>
						<span @click='entryDetail = false'>返回考评管理列表</span>
					</div>
					<div>考评规则管理</div>
				</header>

				<div class="wm-person-rule-list">
					<header>
						{{periodsName}}  <span>第 {{ruleIndex}} 期</span>
					</header>
					<ul class="wm-role-rule" :style="{height:viewH - 60-60 - 60 - 60 + 'px'}">
						<li class="wm-role-item" v-for="(role,i) in roleList" :key="i">
							<div class="wm-role-name">{{role.rolename}}</div>
							<div class="wm-checkitem-weight">
								<div>评分项名称</div>
								<div>权重</div>
								<div style="opacity:0;width:80px;flex-grow:0;-webkit-flex-grow:0;">权</div>
							</div>
							
							<div v-for='(checkitemweight,k) in role.checkitemWeightList' :key="k">
								<div class="wm-checkitem-rule-item">
									<div>
										<Select style="width:100px" v-model="checkitemweight.checkitemid">
											<Option  v-for="(item) in checkItemList" :value="item.checkitemid" :key="item.checkitemid">{{ item.title }}</Option>
										</Select>
									</div>
									<div>
										<Input type='text' v-model="checkitemweight.weight"/>
									</div>
									<div>
										<span @click="delCheckitemWeight(i,k)"><Icon type="ios-minus-outline"></Icon></span>
										<span @click="addCheckitemWeight(i)" v-if='k === role.checkitemWeightList.length-1'><Icon type='ios-plus'/> </span>
									</div>
								</div>
							</div>
							<div class="wm-checkitem-rule-item" v-if='role.checkitemWeightList.length<=0'>
								<div>
									<Select style="width:100px" v-model="role.checkitemWeightList.checkitemid">
										<Option v-for="item in checkItemList" :value="item.checkitemid" :key="item.checkitemid">{{ item.title }}</Option>
									</Select>
								</div>
								<div>
									<Input type='text' v-model="role.checkitemWeightList.weight"/>
								</div>
								<div>
									<span @click="addCheckitemWeight(i)"><Icon type='ios-plus'/> </span>
								</div>
							</div>
						</li>
					</ul>
				</div>

				<footer class="wm-rule-bottom">
					<Button @click="submit" type="primary">提交</Button>
				</footer>
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
						<DatePicker v-model="formItem.starttime" :value='formItem.starttime' format="yyyy-MM-dd" type="date"  placeholder="开始时间"  style="width:100%"></DatePicker>
					</FormItem>
					<FormItem label="结束时间 ：">
						<DatePicker v-model="formItem.endtime" format="yyyy-MM-dd" type="date"  placeholder="结束时间"  style="width:100%"></DatePicker>
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
				showRulePage:false,
				viewH:window.innerHeight,
				scoreList:[],
				keyword:'',
				ruleIndex:-1,
				entryDetail:false,
				isNoScore:false,
				entryDetail1:false,
				checkitemWeightList:[],
				checkItemList:[],
				standardList:[],
				roleList:[],
				title:"",
				periodsIndex:1,
				periodsName:'',
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
			this.getCheckItemList();
			window.s = this;
		},
		watch:{
			keyword(val){
				this.dataSource = this.defaultSource.filter((item,i)=>{
					return item.username.indexOf(val)>-1;
				});
			}
		},
		methods:{
			submit(){
				var s = this;
				
				var arrCache = [],
					arr  = [];
				s.roleList.forEach((role,i)=>{
					arrCache = arrCache.concat(role.checkitemWeightList);
				});
				arrCache.forEach((item,i)=>{
					if(JSON.stringify(item) !==  "{}"){
						arr.push(item)
					}
				})
				console.log(arr);

				return;
				symbinUtil.ajax({
					url:window.config.baseUrl + '/wmadmin/editcheckitemweight/',
					validate:s.validate,
					data:{

					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
					}
				})
			},
			addCheckitemWeight(k){
				var s = this;
				var weightObj = {
					roleid:this.roleList[k].roleid,
					levelnum:this.roleList[k].levelnum,
					periodsnumberid:s.periodsnumberid
				}
				this.roleList[k].checkitemWeightList.push(weightObj);
				this.roleList = this.roleList.concat([]);
			},
			delCheckitemWeight(i,k){
				if(this.roleList[i].checkitemWeightList.length<=1){
					return;
				}
				this.roleList[i].checkitemWeightList.splice(k,1);
				this.roleList = this.roleList.concat([]);	
			},
			openRulePage(periods,index){//打开规则管理页面
				this.entryDetail = true;
				this.showRulePage = true;
				this.periodsnumberid = periods.periodsnumberid;
				this.periodsName = periods.periodsname;
				this.ruleIndex = index+1;

				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getcheckitemweightlist/',
					validate:s.validate,
					data:{
						status:1
					},
					success(data){
						if(data.getret === 0){
							s.roleList.forEach((role,i)=>{
								
								data.list.forEach((dt,k)=>{
								
									if(role.roleid === dt.roleid ){
										if(JSON.stringify(role.checkitemWeightList[0]) === "{}"){
											role.checkitemWeightList.shift();
										}
										role.checkitemWeightList.push(dt);
									}
								})
								
							})
							s.roleList = s.roleList.concat([]);
							
							//s.checkitemWeightList = data.list;
						}
					}
				})
			},
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
						periodsnumberid:periodsid.periodsnumberid
					},
					success(data){
						console.log(data);
					}
				})
			} ,
			periodsAction(){
				var s = this;
				if(this.currentIndex>-1){//编辑
					s.formItem.starttime = new Date(s.formItem.starttime).toLocaleDateString().replace(/\//ig,'-');
					s.formItem.endtime = new Date(s.formItem.endtime).toLocaleDateString().replace(/\//ig,'-');
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/editperiodsnumber/',
						validate:s.validate,
						data:{
							periodsnumberid:s.periodsnumberid,
							periodsname:s.formItem.periodsname,
							starttime:s.formItem.starttime,
							endtime:s.formItem.endtime,
							switch:s.formItem.status
						},
						success(data){
							console.log(data);
						}
					})
				}
				else{
				
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
				this.formItem = periods;
				this.periodsnumberid = periods.periodsnumberid;
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
				this.showRulePage = false;
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
								//item.starttime = new Date(item.starttime).Format("yyyy-MM-dd");
								//item.endtime = new Date(item.endtime).Format("yyyy-MM-dd");
							//	item.endtime.Format("yyyy-MM-dd")
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
						if(data.getret === 0){
							s.roleList = data.list;
							s.roleList.forEach((role,i)=>{
								role.checkitemWeightList = role.checkitemWeightList || [{}]
							})
						}
					}
				})
			},
			getCheckItemList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl + '/wmadmin/getcheckitemlist/',
					data:{},
					validate:s.validate,
					success(data){
						if(data.getret === 0){
							s.checkItemList = data.list;
						}
					}
				})
			}
		}
	}
</script>
 
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
				<div :style="{height:viewH - 130 +'px',overflow:'auto'}" class='wm-scroll'>
					<section>
						<div v-for='(periods,i) in periodsList' :key="i" class="wm-periods-item">
							<div>
								<h2>
									<div>{{periods.periodsname}} <span>第{{periodsList.length - i}}期</span></div>
									<div title='评分规则管理' @click='openRulePage(periods,i)'><img :src="imgs.ruleIco" alt=""></div>
								</h2>
								<section @click="getPeriodsDetail(periods,i,periodsList.length - i)">
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
									 <Poptip
										confirm
										title="确定要删除吗?"
										@on-ok="deletePeriods(periods,i)"
										>
										<span class="wm-periods-del"><Icon type="android-delete"></Icon>删除</span>
									</Poptip>
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
						<li class="wm-role-item wm-scroll" v-for="(role,i) in roleList" :key="i">
							<div class="wm-role-name">{{role.rolename}}</div>
							<div class="wm-checkitem-weight">
								<div>评分项名称</div>
								<div>权重</div>
								<div style="opacity:0;width:80px;flex-grow:0;-webkit-flex-grow:0;">权</div>
							</div>
							
							<div v-for='(checkitemweight,k) in role.checkitemWeightList' :key="k">
								<div class="wm-checkitem-rule-item">
									<div>
										<Select @on-change='change($event,i)' style="width:100px" v-model="checkitemweight.checkitemid">
											<Option  v-for="(item) in checkItemList" :value="item.checkitemid" :key="item.checkitemid">{{ item.title }}</Option>
										</Select>
									</div>
									<div>
										<Input type='text' @on-change='change($event,i)' v-model="checkitemweight.weight"/>
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
				<div class="wm-periods-table-list" v-if='!showRulePage'>
					<div class="wm-periods-title">
						<div>
							{{title}} <span>第{{currentQISHU}}期</span>
						</div>
						<div>
							<Button type='primary' icon='social-euro' @click='exportData'> 导出</Button>
							<Input  v-model="keyword" placeholder="请输入你要查找的人员姓名" style="width:200px;" />
						</div>
					</div>
					<!-- <Table @on-row-click='entryDetailPage' :loading='loading' stripe :height='viewH - 64-60 - 60' ref='scorelist'  :data='dataSource' :columns='columns'></Table> -->
					 <Tabs v-model="tab" type="card">
						<TabPane :label='item.groupid' v-for='(item,i) in dataSource'  :key='i'>
							<Table ref='scorelist' @on-row-click='entryDetailPage'  :height='viewH - 64-60 - 80' :data='item.user' :columns='item.columns' :loading='loading' stripe></Table>
						</TabPane>
					</Tabs>
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
						<i-switch v-model="formItem.status" size="large">
							<span slot="open">可用</span>
							<span slot="close">禁用</span>
						</i-switch>
					</FormItem>
				
				</Form>
			</div>
   		 </Modal>
		<Spin fix v-if="spinShow">
			<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
			<div>Loading</div>
		</Spin>
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
				tab:0,
				noscorelist:[],
				imgs:window.imgs,
				visible:false,
				loading:true,
				currentQISHU:1,
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
				spinShow:false,
				periodsIndex:1,
				periodsName:'',
				periodsnumberid:-1,//当前的考评期数
				periodsUserName:'',
				formItem:{
					periodsName:'',
					status:true,
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
			change(e,index){

				console.log(e,index);
				//this.addCheckitemWeight(0);
			},
			initData(){
				var  s = this;
				this.spinShow = true;
				this.$Spin.show({
					render: (h) => {
							return h('div', [
								h('Icon', {
									'class': 'demo-spin-icon-load',
									props: {
										type: 'load-c',
										size: 18
									}
								}),
								h('div', '数据正在初始化……')
							])
						}
				});
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/inituserscore/',
					data:{},
					validate:s.validate,
					success(data){ 
						if(data.getret === 0){
							symbinUtil.ajax({
								url:window.config.baseUrl+'/wmadmin/inituserscoreperson/',
								data:{},
								validate:s.validate,
								success(data){
									if(data.getret === 0){
										symbinUtil.ajax({
											url:window.config.baseUrl+'/wmadmin/initusertotal/',
											data:{},
											validate:s.validate,
											success(data){
												if(data.getret === 0){
													s.$Message.success('数据初始化成功')
													s.spinShow = false;
													s.$Spin.hide();
												}
											}
											
										})			
									}
								}
								
							})
						}
					}
				})
			},
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


				symbinUtil.ajax({
					url:window.config.baseUrl + '/wmadmin/addcheckitemweight/',
					validate:s.validate,
					data:{
						list:JSON.stringify(arr)
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.$Notice.warning({
								title: '提示',
								desc:'需要您去人员管理界面手动初始化本次考评，修改方可生效',
								duration: 0
							});
							//s.initData();
						}
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
				this.ruleIndex = this.periodsList.length - index;



				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getcheckitemweightlist/',
					validate:s.validate,
					data:{
						status:1,
						periodsnumberid:periods.periodsnumberid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							if(s.roleList){
								s.roleList.forEach((role,i)=>{
									role.checkitemWeightList = [];
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
							}
							
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
			deletePeriods(periodsid,index){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/delperiodsnumber/',
					validate:s.validate,
					data:{
						periodsnumberid:periodsid.periodsnumberid
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.periodsList.splice(index,1);
						}
					}
				})
			} ,
			periodsAction(){
				var s = this;
				/* console.log({
							periodsnumberid:s.periodsnumberid,
							periodsname:s.formItem.periodsname,
							starttime:s.formItem.starttime,
							endtime:s.formItem.endtime,
							switch:s.formItem.status
						});
						return; */
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
							status:s.formItem.status|0
						},
						success(data){
							s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
							console.log(data);
						}
					})
				}
				else{
					s.formItem.starttime = new Date(s.formItem.starttime).toLocaleDateString().replace(/\//ig,'-');
					s.formItem.endtime = new Date(s.formItem.endtime).toLocaleDateString().replace(/\//ig,'-');

					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/addperiodsnumber/',
						validate:s.validate,
						data:s.formItem,
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
							s.getPeriodsList();
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
					var checkItemList = s.dataSource[s.tab].checkitemlist;
					
					s.dataSource1 = s.defaultSource1.filter((item,i)=>{
						var flag = false;
						checkItemList.forEach((ch,ik)=>{
							if(item['score'+ch.checkitemid] === 0){
								flag = true;
							}
						});

						return flag;
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
			getPeriodsDetail(periods,i,index){
				this.entryDetail = true;
				this.periodsIndex = i+1;
				this.showRulePage = false;
				this.currentQISHU = index;
				this.getScoreList(periods.periodsnumberid);

				this.periodsnumberid = periods.periodsnumberid;
			},
			exportData(){
				var s = this;
				var role = this.tab === 0 ? '主任':this.tab === 1 ? '组长' :'员工';
				this.$refs.scorelist[this.tab].exportCsv({
					filename: s.title+'_'+role+'_考评结果'
				});
			},
			getPeriodsList(){
				var s = this;
				window.s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getperiodsnumberlist',
					data:{
						//status:1
					},
					validate:s.validate,
					success(data){
						if(data.getret === 0){
							data.list.forEach((item,i)=>{
								/* item.starttime = new Date(item.starttime).Format("yyyy-MM-dd");
								item.endtime = new Date(item.endtime).Format("yyyy-MM-dd");*/
							//	item.endtime.Format("yyyy-MM-dd")
							})
							///console.log(data,'= ==')
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
				 this.columns1[0] =  {
					key:"username",
					title:'姓名',
					align:'center',
					width:120,
					render:(h,params)=>{
						return h('div',[
							h('span',{
								style:{
									marginRight:'10px'
								}
							},params.row.username),
							h('span',{
								style:{
									color:'#f00',
									fontWeight:'bold'
								}
							},'('+params.row.rolename+")")
						])
					}
				};
				 

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getalluserscore/',
					validate:s.validate,
					data:{
						periodsnumberid
					},
					success(data){
						if(!data.list[0]){

							return;
						}
						s.dataSource = data.list[0].user;
						s.dataSource.forEach((item,i)=>{
							item.columns = [
								{
									title:'姓名',
									key:'username',
									width:120,
									align:'center',
									render:(h,params)=>{
										return h('div',[
											h('span',{
												style:{
													marginRight:'10px'
												}
											},params.row.username),
											h('span',{
												style:{
													color:'blue'
												}
											},params.row.activenum + '/' + params.row.totalnum)
										])
									}
								}
							];
							item.checkitemlist.forEach((user,k)=>{
								item.columns.push({
									title:user.title,
									align:'center',
									key:'score'+user.checkitemid
								});
								k===0 && console.log(item.columns)
							});
							item.columns.push({
								title:'综合评分',
								key:"avgscore",
								align:'center',
								sortable: true,
								render:(h,params)=>{
									var right = params.row;
									return h('div',[
										h('span',{
											style:{
												color:right.avgscore<60?'red':right.avgscore<71?"#333":right.avgscore<90?'#333':'green',
												fontSize:'15px',
												fontWeight:'bold',
												marginRight:'10px'
											}
										},right.avgscore<60?'不合格':right.avgscore<71?"基本合格":right.avgscore<90?'合格':'优秀'),
										h('span',{},params.row.avgscore)
									])
								}
							})
						});
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
							var len = 0;
							s.columns1 = [s.columns1.shift()];
							s.dataSource.forEach((dt,i)=>{
								dt.user.forEach((d,k)=>{
									if(d.userid === userid){
										len = dt.checkitemlist.length;
										dt.checkitemlist.forEach((item,l)=>{
											s.columns1.push({
												title:item.title,
												key:'score'+item.checkitemid,
												align:'center',
												render:(h,params)=>{
													var text = params.row['score'+item.checkitemid]<=0?'未评分':params.row['score'+item.checkitemid];
													return h('div',{
														style:{
															color:params.row['score'+item.checkitemid]<=0?'#f00':"#000",
															fontWeight:'bold'
														}
													},text);
												}
											})
										})
									}
								})
							})
							
							//console.log("score"+len);
							/*s.columns1.push({
								title:'综合评分',
								key:"avgscore",
								align:'center',
								sortable: true,
							})*/
							s.noscorelist = data.list.noscorelist;
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
 
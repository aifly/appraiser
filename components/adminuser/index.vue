<template>
	<div class="wm-adminuser-ui">
		<header>
			<div>人员管理</div>
		</header>
		<div>
			<div class="wm-adminuser-header">
				<div>
					<Button icon='plus' type="primary" @click="addPerson">添加</Button>
					<Button icon='trash-a' v-if='false' >删除</Button>
					<Tooltip content="初始化人员评分基础数据" placement="top">
						<Button icon='ios-loop-strong' @click="initData">初始化</Button>
					</Tooltip>
				</div>
				<div>
					<Input type="text" v-model="keyword" @on-change='searchEmployee' />
				</div>
			</div>

			<Table :height='viewH - 60-60-60' @on-select-all='selectall'  stripe :data='dataSource' :columns='columns'></Table>
		</div>
		<Modal v-model="visible" title="人员管理" @on-ok="ok" ok-text="确认" cancel-text="取消" @on-cancel="cancel" class-name="adduser-cls" :loading='isLoading'>
				<Form ref="formAdmin" :model="formAdmin" :rules="adminForm" :label-width="72" >
					<FormItem label="姓名：" prop="username">
						<Input style="width:320px;" v-model="formAdmin.username" placeholder="姓名" autocomplete="off" />
						<RadioGroup v-model="formAdmin.sex">
							<Radio :label="1">
								<span>男</span>
							</Radio>
							<Radio :label="0">
								<span>女</span>
							</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="部门：" prop="job">
						<Row type='flex'>
							<Col span='13'>
							
								<div v-for='(de,i) in formAdmin.departmentid' :key="i" >
									<Cascader change-on-select style="width:180px" :data="department" v-model="formAdmin.departmentid[i]"></Cascader>
									<span v-if='i>0' @click='delDepartment(i)'><Icon  style="cursor:pointer;float:right;font-size:20px;margin-top:-26px;margin-right:10px;" type="minus-circled" ></Icon></span>
									<span  @click="addDepartment" v-if='i===0'><Icon   style="cursor:pointer;float:right;font-size:20px;margin-top:-26px;margin-right:10px;" type="ios-plus" ></Icon></span>
								</div>
								<div v-if='formAdmin.departmentid.length<=0 && currentUserId !==-1'> 
									无
								</div>
							</Col>
							
							<Col  span='5'>
								
								<Select　placeholder='职位' v-model="formAdmin.roleid" style="width:120px">
									<Option v-for="item in roleList" :value="item.roleid" :key="item.roleid">{{ item.rolename }}</Option>
								</Select>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="电话：" prop="mobile">
						<Input v-model="formAdmin.mobile" placeholder="电话" autocomplete="off" />
					</FormItem>
					<FormItem label="是否可评：">
						<Checkbox  v-model='formAdmin.isinselect'>
							<span>可参评</span>
						</Checkbox>
						
						<Checkbox v-model="formAdmin.isselect">
							<span>可被评</span>
						</Checkbox>
					</FormItem>
				</Form>
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
				imgs:window.imgs,
				visible:false,
				isLoading:false,
				spinShow:false,
				formAdmin:{
					departmentid:[]
				},
				departmentArr:[],
				viewH:window.innerHeight,
				adminForm:{},
				pid:-1,
				currentUserId:-1,
				model1:"",
				keyword:'',
				department:[],
				roleList:[],
				columns:[
					{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
					{
						title:"姓名",
						key:"username",
						align:'center'
					},{
						title:"性别",
						key:"sex",
						align:'center',
						render:(h,params)=>{
							return h('div',{},params.row.sex === 1? '男':'女')
						}
					},/* {
						title:"账号",
						key:"useraccount",
						align:'center'
					}, */{
						title:"部门",
						key:"departmentname",
						align:'center',
						render:(h,params)=>{
							if(typeof params.row.departmentname === 'string'){
								return h('div',{},params.row.departmentname || '--')
							}else{
								return h('div',{},params.row.departmentname.join(' , ') || '--')
							}
						}
					},{
						title:"职位",
						key:"rolename",
						align:'center'
					},
					/* {
						title:"电话",
						key:"mobile",
						align:'center',
						width:112,
					}
					, */{
						title:"历届评分详情",
						key:"	",
						align:'center',
						width:110,
						render:(h,params)=>{
							return h('div',{
								props:{
									class:'a'
								},
								style:{
									cursor:'pointer'
								}
							},'历届评分详情')
						}
					},{
						title:"操作",
						key:"",
						align:'center',
						width:200,
						
						render:(h,params)=>{
							return h('div',[
								h('Button', {
                                    props: {
                                        type: 'primary',
										size: 'small',
										icon:'edit'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
											
                                            this.showModal(params.row)
                                        }
                                    }
                                }, '编辑'),
								h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗？"
									},
									on:{
										'on-ok':()=>{
											this.remove(params.index,params.row.employeeid)
										},
										
									}
								},[
									h('Button', {
										props: {
											type: 'error',
											size: 'small',
											icon:'trash-a'
										},
										on: {
											click: () => {
												
												//this.remove(params.index,params.row.employeeid)
											}
										}
									}, '删除')
								]),
                                
							])
						}
					}
				],
				dataSource:[],
				defaultSource:[]
			}
		},
		components:{
		},

		beforeCreate(){
			
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');
			/* {
				username:'aaa',
				score1:14,
				score2:14,
				score3:14,
				score4:14,
				score5:14,
				score6:14,

			} */
			this.validate = validate;
		},
		mounted(){
			
			this.getUserList();
			this.userinfo = symbinUtil.getUserInfo();
		},
		
		methods:{
			searchEmployee(){
				this.dataSource = this.defaultSource.filter((item)=>{
					return item.username.indexOf(this.keyword)>-1
				})
				//console.log(this.keyword)
			},
			addPerson(){//添加人员
				this.visible = true;
				this.currentUserId = -1;
				this.formAdmin.departmentid = [[]];
				//this.formAdmin = {};
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
			selectall(e){
				console.log(e);
			},
			addDepartment(){
				
				this.formAdmin.departmentid.push(['','']);
			},
			delDepartment(index){
				this.formAdmin.departmentid.splice(index,1);
				//this.formAdmin.departmentid.pop();
			},
			ok(){
				//
				var s =  this;
				
				if(this.currentUserId!==-1){//编辑
					console.log(s.formAdmin.departmentid.length);
					var departmentids = '';
					var len = s.formAdmin.departmentid;
					s.formAdmin.departmentid.forEach((item,i)=>{
						var d = item.pop();
						if(item && d){
							departmentids += d+',';
						}
					});
					departmentids = departmentids.substr(0,departmentids.length-1)
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/editemployee/',
						data:{
							employeeid:s.currentUserId,
							realname:s.formAdmin.username,
							mobile:s.formAdmin.mobile,
							sex:s.formAdmin.sex,
							isinselect:s.formAdmin.isinselect|0,
							isselect:s.formAdmin.isselect|0,
							roleid:s.formAdmin.roleid,
							departmentid:departmentids

							
						},
						validate:s.validate,
						success(data){
							s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
							if(data.getret === 0){
								s.initData();
							}
							//console.log(data);
						}
					})
				}else{//
					var departmentids = '';
					var len = s.formAdmin.departmentid;
					s.formAdmin.departmentid.forEach((item,i)=>{
						var d = item.pop();
						if(item && d){
							departmentids += d+',';
						}
					});
					departmentids = departmentids.substr(0,departmentids.length-1)
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/addemployee/',
						data:{
							realname:s.formAdmin.username,
							loginusername:s.formAdmin.username,
							companyid:s.userinfo.companyid,
							userpwd:'123456',
							mobile:s.formAdmin.mobile,
							sex:s.formAdmin.sex,
							isinselect:s.formAdmin.isinselect|0,
							isselect:s.formAdmin.isselect|0,
							roleid:s.formAdmin.roleid,
							departmentid:departmentids
							
						},
						validate:s.validate,
						success(data){
							//console.log(data);
							s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
							if(data.getret === 0){
								s.initData();
							}
							//console.log(data);
						}
					})
				}
			},
			cancel(){},	
			showModal(row){

				this.formAdmin = row;
				this.formAdmin.isinselect = !!this.formAdmin.isinselect;
				this.formAdmin.isselect = !!this.formAdmin.isselect;
				this.currentUserId = row.employeeid;
				this.visible = true;
				
			},
			remove(index,employeeid){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl + '/wmadmin/delemployee/',
					validate:s.validate,
					data:{
						employeeid,
						deltype:1
					},
					success(data){
						s.dataSource.splice(index,1);
						s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
					}
				})
			},
			getUserList(){
				var s = this;

				/* $.getJSON("./components/adminuser/data.json",data=>{
					if(data.getret === 0){
							//console.log(data);
							//var data = data.list;
							s.dataSource = data.list;
							var defaultDepartment = data.department.concat([]);
							data.department.map((item,i)=>{
								if(item.pid === ''){
									s.department.push({
										value:item.departmentid,
										label:item.departmentname,
										children:[]
									})
								}
							});
							
							defaultDepartment.map((dt,a)=>{
								
								s.department.forEach((department,k)=>{
									//console.log(department.value , ' ------ ',dt)
									if(department.value === dt.pid){
										department.children.push({
											value:dt.departmentid,
											label:dt.departmentname,
										})
									}
								}) 
								
								
							});

							
							//s.department = data.department;
							s.roleList = data.role;
						}
				}) */


				

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadmin/getemployeeuserlist',
					validate:s.validate,
					data:{},
					success(data){
						if(data.getret === 0){
							//console.log(data);
							var data = data.list;
							s.dataSource = data.list;
							s.defaultSource = data.list.concat([]);
							var defaultDepartment = data.department.concat([]);
							data.department.map((item,i)=>{
								if(item.pid === ''){
									s.department.push({
										value:item.departmentid,
										label:item.departmentname,
										children:[]
									})
								}
							});
							
							defaultDepartment.map((dt,a)=>{
								
								s.department.forEach((department,k)=>{
									//console.log(department.value , ' ------ ',dt)
									if(department.value === dt.pid){
										department.children.push({
											value:dt.departmentid,
											label:dt.departmentname,
										})
									}
								}) 
								
								
							});
							//s.department = data.department;
							s.roleList = data.role;
						}
					}
				})
				 
			}
		}
	}
</script>
 
 <style>
	
	 .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

 </style>
 
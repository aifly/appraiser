<template>
	<div class="wm-adminuser-ui">
		<header>
			<div>人员管理</div>
		</header>
		<div>
			<div class="wm-adminuser-header">
				<div>
					<Button icon='plus' type="primary">添加</Button>
					<Button icon='trash-a' >删除</Button>
				</div>
				<div>
					<Input  />
				</div>
			</div>

			<Table  @on-select-all='selectall'  stripe :data='dataSource' :columns='columns'></Table>
		</div>
		<Modal v-model="visible" title="人员管理" @on-ok="ok" ok-text="确认" cancel-text="取消" @on-cancel="cancel" class-name="adduser-cls" :loading='isLoading'>
				<Form ref="formAdmin" :model="formAdmin" :rules="adminForm" :label-width="70" >
					<FormItem label="姓名 :" prop="username">
						<Input style="width:320px;" v-model="formAdmin.username" placeholder="姓名" autocomplete="off" />
						<RadioGroup v-model="formAdmin.sex">
							<Radio label="1">
								<span>男</span>
							</Radio>
							<Radio label="0">
								<span>女</span>
							</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="职位 :" prop="job">
						<Row type='flex'>
							<Col span='15'>
								<Cascader change-on-select style="width:220px" :data="department" v-model="departmentArr"></Cascader>
							</Col>
							<Col  span='5'>
								<Select v-model="formAdmin.roleid" style="width:120px">
									<Option v-for="item in roleList" :value="item.roleid" :key="item.roleid">{{ item.rolename }}</Option>
								</Select>
							</Col>
							<Col span='1'>
								<Icon style="margin-left:40px;font-size:20px;margin-top:6px;" type="ios-plus"></Icon>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="电话 :" prop="mobile">
						<Input v-model="formAdmin.mobile" placeholder="电话" autocomplete="off" />
					</FormItem>
					<FormItem label="是否可评 :" prop="mobile">
						 <Checkbox :label="formAdmin.isinselect">
							<span>可参评</span>
						</Checkbox>
						<Checkbox :label="formAdmin.isselect">
							<span>可被评</span>
						</Checkbox>
					</FormItem>
				</Form>
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
				imgs:window.imgs,
				visible:true,
				isLoading:false,
				formAdmin:{},
				departmentArr:[],
				adminForm:{},
				pid:-1,
				model1:"",
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
						align:'center'
					},{
						title:"账号",
						key:"useraccount",
						align:'center'
					},{
						title:"部门",
						key:"departmentname",
						align:'center'
					},{
						title:"职位",
						key:"job",
						align:'center'
					},{
						title:"电话",
						key:"mobile",
						align:'center'
					},{
						title:"历届评分详情",
						key:"	",
						align:'center',
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
                                            this.showModal(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
										size: 'small',
										icon:'trash-a'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
							])
						}
					}
				],
				dataSource:[]
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
			this.getUserList();
		},
		
		methods:{
			selectall(e){
				console.log(e);
			},
			ok(){},
			cancel(){},	
			showModal(){

			},
			remove(){

			},
			getUserList(){
				var s = this;
				$.getJSON("./components/adminuser/data.json",data=>{
					if(data.getret === 0){
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
				})
			}
		}
	}
</script>
 
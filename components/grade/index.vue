<template>
	<div class="wm-grade-ui">
		<aside>
			<Menu ref='side_menu' theme="dark" width='200' :open-names="openkeys">
                <Submenu :name="i" v-for='(menu,i) in gradeList' :key="i">
                    <template slot="title">
                        {{menu.departmentname}}
                    </template>
                    <MenuItem :name="user.id" v-for='(user,k) in menu.users' :key="k">
						<Icon type='person'></Icon>{{user.name}}
					</MenuItem>
                    <Submenu :name="2" v-for='(group,h) in menu.group' v-if='menu.group' :key='h+"__"'>
		                <template slot="title">
							<Icon type='person-stalker'></Icon>{{group.groupname}}
		                </template>
		                <MenuItem :name="user.id" :key="g+'-'" v-for="(user,g) in group.users"><Icon type='person'></Icon>{{user.name}}</MenuItem>
		            </Submenu>
                </Submenu>
               
            </Menu>
		 
		</aside>
		<aside>
			<header  class="wm-grade-header">
				<div>编辑部</div>
			</header>
			<section class="wm-grade-main-content">
				<div>
					<div class="wm-grade-list">

					</div>
					<footer class="wm-grade-footer">
						<Button type='primary'>提交</Button>
					</footer>
				</div>
				<div ref='wm-standard' :style="{height:viewH - 50-64 +'px'}" >
					<section>
						<div class="wm-standard-item" v-for='(standard,i) in standardList' :key='i'>
							<h3>{{standard.title}}</h3>
							<div>{{standard.itemdetial.replace(/\|/g,'')}}</div>
							<div v-if='false' v-for="(desc,k) in standard.itemdetial.split('|')" :key="k">
								{{desc}}
							</div>
						</div>
					</section>
				</div>
			</section>
			
		</aside>
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
				openkeys:[],
				gradeList:[],
				standardList:[],
				viewH:window.innerHeight
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
			getGradeList(){
				var s = this;
				//console.log(s.validate)
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/getscoreduserlist',
					validate:s.validate,
					data:{},
					success(data){

						//console.log(data.list.left);
						var json = {};
						var obj = {};
						var obj1 = {};
						var obj2 = {};

						var editDepartmentId = '1000000001',
							activeDrumbeatingId ='1000000002',
							affairId = '1000000003';
						var i = 0;
						data.list.department.map((item,i)=>{
							if(!item.pid){
								s.gradeList.push({
									departmentid:item.departmentid,
									departmentname:item.departmentname,
									users:[],
									group:[]
								});

							}
						});

						s.gradeList.map((item,i)=>{
							data.list.left.map((left,j)=>{
								if(left.roleid === '1000000003' && left.pid === item.departmentid){
									s.gradeList[i].group.push({
										groupid:left.departmentid,
										groupname:left.departmentname,
										users:[]
									})
								}
								else if (left.roleid === '1000000002' && left.departmentid === item.departmentid){//主任
									s.gradeList[i].users.push({
										id:left.employeeid,
										name:left.username||''
									})
								}
							})
						});

						s.gradeList.map((item,i)=>{
							data.list.left.map((left,j)=>{
								if(left.roleid === '1000000004' ){
									item.group.map((group,k)=>{
										
										if(group.groupid === left.departmentid){
											group.usersArr = group.usersArr || []
											group.usersArr.push({
												department:left.departmentname,
												id:left.employeeid,
												name:left.realname,
											})
										}
									})
								}
							})
						});
						s.gradeList.forEach((item,i)=>{
							item.group.map((group,k)=>{
								group.users = group.users .concat(group.usersArr)
							})
						})

						

					}
				})
				
				/* $.getJSON('/components/data/grade.json',(data)=>{
					this.gradeList = data.list;
					this.openkeys = [];
					for(var i = 0;i<data.list.length;i++){
						this.openkeys.push(i+'');
					}
					setTimeout(() => {
						$('.ivu-menu-submenu-title').trigger('click')
					}, 100);
				}); */

				symbinUtil.getStandard((data)=>{
					this.standardList = data;
					setTimeout(() => {
						this.standardScroll.refresh();
					}, 100);
				})
			}
		},
		mounted(){
			this.getGradeList();
		
			this.standardScroll = new IScroll(this.$refs['wm-standard'],{
				mouseWheel:true,
				scrollbars:true,
				preventDefault:false
			})
		}
		
	}
</script>
 
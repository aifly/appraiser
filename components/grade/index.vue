<template>
	<div class="wm-grade-ui">
		<aside ref='menu' :style="{height:viewH - 64+'px',overflow:'hidden',position:'relative'}">
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
		                <MenuItem class='wm-submenu' :name="user.id" :key="g+'-'" v-for="(user,g) in group.users"><Icon type='person'></Icon>{{user.name}}</MenuItem>
		            </Submenu>
                </Submenu>
               
            </Menu>
		 
		</aside>
		<aside>
			<header class="wm-grade-header">
				<div>
					{{gradeList[index].departmentname}}
					<span v-for='(user,i) in gradeList[index].users' :key="i">
						{{user.name}}
					</span>
				</div>
			</header>
			<section class="wm-grade-main-content">
				<div>
					<div class="wm-grade-list">
						<section>
							<div v-if='i===0' v-for='(group,i) in gradeList' :key="i">
								<ul  v-for='(user,j) in group.users' :key="j">
									<li v-for='(col,h) in colunms' :key='h'>
										<div>{{col}}</div>
										
									</li>
								</ul>
								<ul v-if='false' v-for='(user,j) in group.group' :key="j">
									<li v-for='(u,k) in user.users' :key='k'>
										<div v-for='(col,h) in colunms' :key='h'>
											{{col}}
										</div>
									</li>
								</ul>
							</div>
						</section>
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
				index:0,
				gradeList:[],
				standardList:[],
				viewH:window.innerHeight,
				colunms:[
					'名称',
					'组员评分',
					'组长评分',
					'主任评分',
					'我的评分'
				]
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

						console.log(data.list);
						var json = {};
						var obj = {};
						var obj1 = {};
						var obj2 = {};

						var userinfo = symbinUtil.getUserInfo();
						console.log(userinfo)
						if(userinfo.userjobid === '1000000003'){

							data.list.left.push({
								employeeid:userinfo.employeeid,
								realname:userinfo.username,
								username:userinfo.username,
								departmentid:userinfo.departmentid,
								departmentname:userinfo.departmentname,
								roleid:userinfo.userjobid,
								rolename:userinfo.userjob,
							});
						}
 
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
								if((left.roleid === '1000000003' && left.pid === item.departmentid) || left.roleid === userinfo.userjobid){
									//组长
									var leader = [];
									if(left.roleid !== userinfo.userjobid){
										leader = [{
												id:left.employeeid,
												name:left.realname + ' '+ left.rolename 
											}]
									}
									item.hasGroupLeader = true;
									s.gradeList[i].group.push({
										groupid:left.departmentid,
										groupname:left.departmentname,
										users:leader
									})
								}
								else if (left.roleid === '1000000002' && left.departmentid === item.departmentid){//主任

									s.gradeList[i].users.push({
										id:left.employeeid,
										name:left.realname + ' '+ left.rolename 
									})
								}
							})
						});

 
						console.log('gradeList',s.gradeList)

						
						s.gradeList.map((item,i)=>{
							data.list.left.map((left,j)=>{
								if(left.roleid === '1000000004' ){//员工
									if(!item.hasGroupLeader){//没有组长和主任
										item.users.push({
											department:left.departmentname,
											id:left.employeeid,
											name:left.realname,
										});
									}
									
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
						//return;
						s.gradeList.forEach((item,i)=>{
							item.group.map((group,k)=>{
								//console.log(group.usersArr)
								group.users = group.users.concat(group.usersArr||[])
							})
						})

						
						setTimeout(() => {
							$('.ivu-menu-submenu-title').trigger('click')

							setTimeout(()=>{
								s.menuScroll.refresh();
							},1200)
						}, 100);	

					}
				})
				
				/* $.getJSON('/components/data/grade.json',(data)=>{
					this.gradeList = data.list;
					this.openkeys = [];
					for(var i = 0;i<data.list.length;i++){
						this.openkeys.push(i+'');
					}
					
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
			});


			this.menuScroll = new IScroll(this.$refs['menu'],{
				mouseWheel:true,
				scrollbars:true,
				preventDefault:false
			})
		}
		
	}
</script>
 
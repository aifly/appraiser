<template>
	<div class="wm-grade-ui">
		<aside ref='menu' :style="{height:viewH - 64+'px',overflow:'hidden',position:'relative'}">
			<Menu @on-select='select($event)' @on-open-change='openChange'  ref='side_menu' theme="dark" width='200' :open-names="openkeys">
                <Submenu :name="i" v-for='(menu,i) in gradeList' :key="i">
                    <template slot="title">
                        {{menu.departmentname}}
                    </template>
                    <MenuItem :name="user.key+'-' + user.departmentid" v-for='(user,k) in menu.users' :key="k">
						<Icon type='person'></Icon>{{user.name}}
					</MenuItem>
                    <Submenu :name="2" v-for='(group,h) in menu.group' v-if='menu.group' :key='h+"__"'>
		                <template slot="title">
							<Icon type='person-stalker'></Icon>{{group.groupname}}
		                </template>
		                <MenuItem class='wm-submenu' :name="user.key+'-' + user.departmentid" :key="g+'-'" v-for="(user,g) in group.users"><Icon type='person'></Icon>
						{{user.name}}
						</MenuItem>
		            </Submenu>
                </Submenu>
               
            </Menu>
		 
		</aside>
		<aside>
			<header class="wm-grade-header" v-if='gradeList[index]'>
				<div>
					{{gradeList[index].departmentname}}
					<span v-for='(user,i) in gradeList[index].users' :key="i">
						{{user.name}}
					</span>
				</div>
			</header>
			<section class="wm-grade-main-content">
				<div>
					<div class="wm-grade-list" ref='grade-list' :style="{height:viewH - 64*2-52+'px'}">
						<section>
							<h1 style="height:20px;background:#f5f7f9"></h1>
							<div v-for='(group,i) in gradeList' :key="i">
								<ul  v-for='(user,j) in group.users' :key="j" :data-index='j'>
									<li  class="wm-grade-group-ico" >
										<div>
											<img :src="imgs.group" alt="">			
										</div>
										<span v-for='(name,n) in user.name.split(" ")' :key="n">
											{{name}}
										</span>
									</li>
									<li class="wm-grade-list-title">
										<div v-for='(col,l) in colunms' :key="l">
											<span v-if='l===0'>
												{{col}}
											</span>
											<label for=""  v-if='l>0'>
												{{col}}
											</label>

										</div>
									</li>
									<li v-for='(right,h) in rightList[user.id]' :key='h'>
										<div>
											<span>
												{{right.checkitemtitle}}
											</span>
											<Poptip width='400' trigger='hover' :title="right.checkitemtitle"  placement="right-start">
												<label>?</label>
												<p slot='content' style="width:350px;min-height:150px;white-space:normal;word-wrap:break-word;box-sizing:border-box;">
													{{right.itemdetial}}
												</p>
											</Poptip>
										</div>
										<div>{{userinfo.userjobid === '1000000001' || userinfo.userjobid === '1000000002'? right.scorebyd:'--'}}</div>
										<div>{{userinfo.userjobid === '1000000001' || userinfo.userjobid === '1000000002'? right.scorebyc:'--'}}</div>
										<div>{{ userinfo.userjobid === '1000000001'? right.scorebyb:'--'}}</div>
										<div>
											<aside></aside>
											<aside>
												<div class="wm-smile" :style="{background:'url('+imgs.smile+') no-repeat 0 '+-48*(right.myscore-1<0?0:right.myscore-1)+'px'}">
													
												</div>
											</aside>
											<aside>
												<Slider :disabled='right.isdisable' v-model="right.myscore" show-input></Slider>
											</aside>
											<aside></aside>
										</div>
									</li>
								</ul>
								<div v-for='(user,jj) in group.group' :key="jj+'-'" class="wm-grade-leader-list">
									<ul v-for='(u,k) in user.users' :key='k' :class="{'wm-has-leader':group.users.length}" :data-index='k+jj*user.users.length+group.users.length'>
										<li  class="wm-grade-group-ico">
											<div>
												<img :src="imgs.group" alt="">			
											</div> 
											<span v-for='(name,n) in u.name.split(" ")' :key="n">
												{{name}}
											</span>
										</li>
										<li class="wm-grade-list-title">
											<div v-for='(col,l) in colunms' :key="l">
												<span v-if='l===0'>
													{{col}}
												</span>
												<label for=""  v-if='l>0'>
													{{col}}
												</label>
											</div>
										</li>
										<li v-for='(right,h) in rightList[u.id]' :key='h'>
											<div>
												<span>
													{{right.checkitemtitle}}
													
												</span>

												<Poptip width='400' trigger='hover' :title="right.checkitemtitle"  placement="right-start">
													<label>?</label>
													<p slot='content' style="width:350px;min-height:150px;white-space:normal;word-wrap:break-word;box-sizing:border-box;">
														{{right.itemdetial}}
													</p>
												</Poptip>

											</div>
											<div>{{userinfo.userjobid === '1000000001' || userinfo.userjobid === '1000000002'? right.scorebyd:'--'}}</div>
											<div>{{userinfo.userjobid === '1000000001' || userinfo.userjobid === '1000000002'? right.scorebyc:'--'}}</div>
											<div>{{ userinfo.userjobid === '1000000001'? right.scorebyb:'--'}}</div>
											<div>
												<aside></aside>
												<aside>
													<div class="wm-smile" :style="{background:'url('+imgs.smile+') no-repeat 0 '+-48*(right.myscore-1<0?0:right.myscore-1)+'px'}">
													
													</div>
												</aside>
												<aside>
													<Slider  :disabled='right.isdisable' v-model="right.myscore" show-input></Slider>
												</aside>
												<aside></aside>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</section>
					</div>
					<footer class="wm-grade-footer">
						<Button type='primary' @click='submit'>提交</Button>
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
				imgs,
				gradeList:[],
				rightList:{},
				standardList:[],
				viewH:window.innerHeight,
				userinfo:{},
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
			openChange(){
				setTimeout(() => {
					this.menuScroll.refresh();		
				}, 600);
			},
			select(data){
				var key = data.split('-')[0],
					departmentid = data.split('-')[1];
				var y = -key*340;
				//
				
				this.gradeList.map((item,i)=>{
					if(departmentid === item.departmentid){
						this.index = i;
					}
				});
	
				if(!this.gradeList[this.index].users.length){
					y = -key * 320-20;
				}
				//console.log(y);
				this.mainScroll.scrollTo(0,y,500);
			},
			submit(){
				var s = this;
				var arr = [];
				for(var right in s.rightList){
					s.rightList[right].forEach((r,k)=>{
						if(r.myscore>0){
							arr.push({
								"employeeid": r.employeeid, 
								"checkitemid":r.checkitemid, 
								"score": r.myscore
							})
						}
					})
					
				}
			/* 	
				if(arr.length <= 0){
					this.$Message.error('没有要提交的分数');
					return;
				} */
				//console.log(JSON.stringify(arr));
				symbinUtil.ajax({
					url:window.config.baseUrl +'/wmuser/postscore/',
					validate:s.userinfo,
					data:{
						roleid:s.userinfo.userjobid,
						scoredlist:JSON.stringify(arr)
					},
					success(data){
						console.log(data.getret);
						s.$Message[data.getret === 0?'success':'error'](data.getmsg);
						if(data.getret === 0){
							for(var right in s.rightList){
								s.rightList[right].forEach((r,k)=>{
									if(r.myscore>0){
										r.isdisable = true;
									}
								})
								
							}
						}
					}
				})

			},
			getGradeList(){


				//$.ajax({url:"http://weblink01-ts.huawei.com/supappserver/individual/individual/getCollectionList.json",data:{lang:'zh',pbild:"PBli-60977",updateTimeStr:"",appVersion:'5.1.0',checkMore:true,getWebLink:true},success(data){console.log(data)}})
				//$.getJSON("http://weblink01-ts.huawei.com/supappserver/individual/individual/getCollectionList.json")
				//$.getJSON("http://weblink01-ts.huawei.com/myproductappservice/product/isMyProduct.json")
				
				var s = this;
				window.s = this;
				//console.log(s.validate)
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/getscoreduserlist',
					validate:s.validate,
					data:{},
					success(data){

						var userinfo = symbinUtil.getUserInfo();

						s.userinfo = userinfo;

						console.log(data.list);

						
						for(var right in data.list.right){
							
							if(data.list.right[right].length<=0){
								data.list.right[right] = [
									{
										"employeeid": right, //"checkitemid": "1",  //评分项编号
										
										"checkitemtitle": "工作目标",  //评分项名称
										"checkitemid":"1",
										"itemdetial":"①没有完成工作目标，或滞后比较严重（1-60分）②规定时间内完成工作目标，工作质量基本符合要求（61-70分）③及时的完成工作目标，工作质量比较让人满意（71-89分）④提前出色的完成工作目标（90-100分）",
										"myscore": 0,   //我的评分
										"scorebyd": 0,   //员工综合评分
										"scorebyc": 0,    //组长综合评分
										"scorebyb": 0,   //主任综合评分
										"scorebya": 0    //领导综合评分
									},{
										"employeeid": right, //"checkitemid": "2",  //评分项编号
										"checkitemtitle": "工作态度",  //评分项名称
										"itemdetial":"①工作被动，行动迟缓，需要领导的反复督促，才能完成职责内的工作；（1-60分）②不需要他人督促，能够积极主动地完成职责内的工作；（61-70分）③在积极主动地完成职责内工作的同时，愿意接受各种临时、突发性工作；（71-89分）④能够积极主动地完成职责内的工作，主动承担各种临时、突发性工作任务，并且在遇到很大困难的情况下仍然去执行。（90-100分）",
										"checkitemid":"2",
										"myscore": 0,   //我的评分
										"scorebyd": 0,   //员工综合评分
										"scorebyc": 0,    //组长综合评分
										"scorebyb": 0,   //主任综合评分
										"scorebya": 0    //领导综合评分
									},{
										"employeeid": right, //"checkitemid": "1",  //评分项编号
										"checkitemtitle": "领导力",  //评分项名称
										"itemdetial":"①工作开展无计划、无章法，不善于分配工作与授权，缺乏知道员工的方法，下属怨言较大，不关心也不能有效的激励员工，协调能力差，不能协调各方面的关系，常常无法解决工作中遇到的棘手问题、冲突和矛盾。（1-60分）②基本能够按照要求制定工作计划，基本合理分配各项工作与授权，具备一定指导下属的能力，偶尔利用奖励等机制提高员工积极性，基本能协调各方面的关系，工作中遇到棘手问题、冲突和矛盾能够保持冷静，掌握基本的调解技巧。（61-70分）③具有较强的定制计划能力，能够较好的分配工作与授权并引导下属完成任务，能够利用奖励等机制提高员工积极性，能够协调各方面的关系，保持良好沟通，及时解决工作中遇到的棘手问题、冲突和矛盾。（71-89分）④具有极强的定制计划的能力，并且善于分配工作与授权，积极引导下属完成任务，并灵活运用奖励表彰等方式调动下属积极性，妥善处理各方面的关系，能够成功解决工作中遇到的棘手问题、冲突和矛盾，能用发展的眼光看待问题。（（90-100分）",
										"checkitemid":"3",
										"myscore": 0,   //我的评分
										"scorebyd": 0,   //员工综合评分
										"scorebyc": 0,    //组长综合评分
										"scorebyb": 0,   //主任综合评分
										"scorebya": 0    //领导综合评分
									},
									{
										"employeeid": right, //"checkitemid": "1",  //评分项编号
										"checkitemtitle": "创新思考",  //评分项名称
										"itemdetial":"①墨守成规，缺乏创新观念，工作中只是被动接受任务，缺乏主动思考；（1-60分）②根据工作需要，有创新观念，但没有举措，观念无法落地；（61-70分）③工作中主动思考，有创新观念且有可行举措，提议新的观点、方法或流程合理且得到采纳，工作效率和工作水平有所提升；（71-89分）④经常保持创造性思维，主动建议新观点、新方法，经常有计划、有步骤的进行能力和知识更新并与自身工作相结合，工作效率和工作水平有明显提升。（90-100分）",
										"checkitemid":"4",
										"myscore": 0,   //我的评分
										"scorebyd": 0,   //员工综合评分
										"scorebyc": 0,    //组长综合评分
										"scorebyb": 0,   //主任综合评分
										"scorebya": 0    //领导综合评分
									},{
										"employeeid": right, //"checkitemid": "1",  //评分项编号
										"checkitemtitle": "处理能力",  //评分项名称
										"itemdetial":"①理解、领悟能力较差，经常无法处理事务或处理事务经常出现错误，处理事务无头绪；（1 - 60 分） ②具有一定的理解力和领悟力，在主管的指导下能够正常处理事务且不常出现错误；（61-70分）③对事务有初步判断的能力，工作思路和工作方法清晰，能够自主处理事务且不出现错误；（71-89分）④对事物有准确的把握和判断,能够分清轻重缓急，计划性、条理性很强，处理事务非常得体。（90-100分）",
										"checkitemid":"5",
										"myscore": 0,   //我的评分
										"scorebyd": 0,   //员工综合评分
										"scorebyc": 0,    //组长综合评分
										"scorebyb": 0,   //主任综合评分
										"scorebya": 0    //领导综合评分
									},{
										"employeeid": right, //"checkitemid": "1",  //评分项编号
										"checkitemtitle": "工作纪律",  //评分项名称
										"itemdetial":"①劳动纪律散漫，经常迟到、早退、缺勤，经常请假，不注意着装规范，工作时间经常做与工作无关的事；（1-60分）②偶尔迟到、早退，工作时间偶尔浏览网页，着装基本符合要求，但有待进一步改进；（61-70分）③按时出勤，无迟到、早退现象，着装规范，遵守工作秩序和各项规章制度，在部门内起到带头作用；（71-89分）④严格自律，不出现任何违反劳动纪律的现象，主动规劝他人遵守劳动纪律，为部门劳动纪律管理起到模范作用。（90-100分）",
										"checkitemid":"6",
										"myscore": 0,   //我的评分
										"scorebyd": 0,   //员工综合评分
										"scorebyc": 0,    //组长综合评分
										"scorebyb": 0,   //主任综合评分
										"scorebya": 0    //领导综合评分
									}
								]
							}
						}

						s.rightList = data.list.right;

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

								if((left.roleid === '1000000003' && left.pid === item.departmentid) || left.roleid === userinfo.userjobid && left.roleid !== '1000000002'){
									//组长
									var leader = [];
									if(left.roleid !== userinfo.userjobid){
										leader = [{
											id:left.employeeid,
											name:left.realname + ' '+ left.rolename,
											departmentid:item.departmentid
										}]
									}

									item.hasGroupLeader = true;
									s.gradeList[i].group.push({
										groupid:left.departmentid,
										groupname:left.departmentname,
										users:leader
									})
								}
								if (left.roleid === '1000000002' && left.departmentid === item.departmentid){//主任

									 

									s.gradeList[i].users.push({
										id:left.employeeid,
										name:left.realname + ' '+ left.rolename,
										departmentid:item.departmentid
									})
								}
							})
						});


						
						s.gradeList.map((item,i)=>{
							data.list.left.map((left,j)=>{
								if(left.roleid === '1000000004' ){//员工
									if(!item.hasGroupLeader){//没有组长和主任
										item.users.push({
											department:left.departmentname,
											departmentid:item.departmentid,
											id:left.employeeid,
											name:left.realname,
										});
									}
									
									item.group.map((group,k)=>{
										if(group.groupid === left.departmentid){
											
											group.usersArr = group.usersArr || []
											group.usersArr.push({
												department:left.departmentname,
												departmentid:item.departmentid,
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
						});
						

						var iNow = 0;
						s.gradeList.forEach((item,i)=>{
							
							item.users.forEach((user,k)=>{
								user.key = iNow;
								iNow++;
							});
							item.group.forEach((group,g)=>{
								group.users.forEach((item,u)=>{
									item.key = iNow;
									iNow++;
								})
							})
						});

						
						setTimeout(() => {
							$('.ivu-menu-submenu-title').trigger('click')

							setTimeout(()=>{
								s.menuScroll.refresh();
								s.mainScroll.refresh();
							},1200)
						}, 100);

					}
				});

				
				
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

			this.userinfo = symbinUtil.getUserInfo();
			if(this.userinfo.isadmin){
				window.location.hash = '/periods';
				return;
			}
			this.getGradeList();
			this.standardScroll = new IScroll(this.$refs['wm-standard'],{
				interactiveScrollbars:true,
				mouseWheel:true,
				scrollbars:true,
				preventDefault:false
			});


			this.menuScroll = new IScroll(this.$refs['menu'],{
				interactiveScrollbars:true,
				mouseWheel:true,
				scrollbars:true,
				preventDefault:false
			});

			this.mainScroll = new IScroll(this.$refs['grade-list'],{
				interactiveScrollbars:true,
				mouseWheel:true,
				scrollbars:true,
				preventDefault:false
			})
		
		}
		
	}
</script>
 
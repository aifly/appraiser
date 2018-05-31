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
                    <Submenu name="3">
		                <template slot="title">
							<Icon type='person-stalker'></Icon>{{menu.group.groupname}}
		                </template>
		                <MenuItem :name="user.id" :key="g" v-for="(user,g) in menu.group.users"><Icon type='person'></Icon>{{user.name}}</MenuItem>
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
							<h3>{{standard.name}}</h3>
							<div>{{standard.desc.replace(/\|/g,'')}}</div>
							<div v-if='false' v-for="(desc,k) in standard.desc.split('|')" :key="k">
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
		//	var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		
		methods:{
			getGradeList(){
				
				$.getJSON('/components/data/grade.json',(data)=>{
					this.gradeList = data.list;
					this.openkeys = [];
					for(var i = 0;i<data.list.length;i++){
						this.openkeys.push(i+'');
					}
					setTimeout(() => {
						$('.ivu-menu-submenu-title').trigger('click')
					}, 100);
				});

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
 
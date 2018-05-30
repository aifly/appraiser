<template>
	<div class="wm-grade-ui">
		<aside>
			<Menu theme="dark" width='200'>
                <Submenu name="1" v-for='(menu,i) in gradeList' :key="i">
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
		                <MenuItem :name="user.id" v-for="(user,g) in menu.group.users"><Icon type='person'></Icon>{{user.name}}</MenuItem>
		                
		            </Submenu>
                </Submenu>
               
            </Menu>
		</aside>
		<aside></aside>
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
				gradeList:[],
				standardList:[]
			}
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		
		methods:{
			getGradeList(){
				$.getJSON('/components/data/grade.json',(data)=>{
					this.gradeList = data.list;
				
				});
				symbinUtil.getStandard((data)=>{
					this.standardList = data;
				})
			}
		},
		mounted(){
			this.getGradeList();
			 
		}
		
	}
</script>
 
<template>
	<div class="wm-user-ui">
		<header>
			<div>我的资料</div>
		</header>
		<div>
			<div class="wm-user-item">
				<div class="wm-user-head">
					<img :src="imgs.man" alt="">
					<div>{{userinfo.username}}</div>
					<Button type='primary' size='small'>修改头像</Button>
				</div>
				<div>
					<div>姓名：{{userinfo.username}}</div>
					<div>部门：{{userinfo.departmentname||'--'}}</div>
				</div>
				<div>
					<div>性别：男</div>
					<div>职位：{{userinfo.userjob}}</div>
				</div>
				<div>
					<div>账号：{{userinfo.username}}</div>
					<div>电话：{{userinfo.usermobile}}  <span class="wm-modify-tel">修改</span></div>
				</div>
				<div>
					<div style="opacity:0">1</div>
					<div>
						<Button>修改密码</Button>
					</div>
				</div>
			</div>
		</div>
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
				userinfo:{}
			}
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			if(this.userinfo.isadmin){

				window.location.hash = '/periods';
			}
		},
		
		methods:{

		}
	}
</script>
 
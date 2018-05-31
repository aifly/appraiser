<template>
	<div class="wm-user-ui">
		<header>
			<div>我的资料</div>
		</header>
		<div>
			<div class="wm-user-item">
				<div class="wm-user-head">
					<img :src="imgs.man" alt="">
					<div>徐畅</div>
					<Button type='primary' size='small'>修改头像</Button>
				</div>
				<div>
					<div>姓名：徐畅</div>
					<div>部门：编辑部</div>
				</div>
				<div>
					<div>性别：男</div>
					<div>职位：主任</div>
				</div>
				<div>
					<div>账号：12345</div>
					<div>电话：15784555312  <span class="wm-modify-tel">修改</span></div>
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
			}
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		mounted(){
			
		},
		
		methods:{

		}
	}
</script>
 
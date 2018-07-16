<template>
	<div  class="wm-login-ui lt-full">
		<header>
			<img :src="imgs.logo"  />
			<span>考评系统</span>
		</header>
		<section>
			<div class="wm-login-C">
				<img :src="imgs.loginTitle" alt="" class="wm-login-title">
				<div class="wm-form-item">
					<Icon type="person"></Icon><input autocomplete="off" v-model="username" type="text" placeholder="请输入账号">
				</div>
				<div class="wm-form-item">
					<Icon type="locked"></Icon><input  autocomplete="off" @keydown.13='login' v-model="password" type="password" placeholder='请输入密码'>
				</div>
				<div class="wm-form-remember">
					<Checkbox v-model="checked" >
						<span>记住密码</span>
					</Checkbox>
				</div>
				<div class="wm-form-login-btn">
					<transition name='error'>
						<div class="wm-form-errmsg" v-if='errorMsg'>
							{{errorMsg}}
						</div>
					</transition>
					<div class="wm-login-btn" @click='login'>登录 <Icon v-if='showLoading' type="load-c" class="demo-spin-icon-load"></Icon></div>
				</div>
				<div class="wm-copyright">
					中国文明网 &copy;版权所有
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import './index.css';
	import $ from 'jquery';
	import symbinUtil from '../lib/util';

	import Vue from "vue";

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
				username:'',
				password:'',
				checked:false,
				isLogined:false,
				isMove:false,
				showLoading:false,
				showError:false,
				errorMsg:'',
				loginType:"员工登录",
				viewH:document.documentElement.clientHeight
			}
		},
		components:{
		},
		
		methods:{
			toastError(msg =  '用户名不能为空'){
				this.errorMsg = msg;
 				this.showError = true;
 				setTimeout(()=>{
 					this.errorMsg = '';
 					this.showError = false;
 				},2000)
			},
			login(){
				var _this = this;
				
				var isAdmin = this.loginType === '超级管理员登录';

				
				if(!this.username){
					this.toastError();
 					return;
				}
				if(!this.password){
					this.toastError('密码不能为空');
 					return;
				}

				this.showLoading = true;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/login/',
					data:{
						username:_this.username,
						userpwd:_this.password
					},
					fn(data){
						if(data.getret === 0){
							var param = data;
							delete param.getret;
							delete param.getmsg;
							
							if(data.userinfo.isinselect === 0 && data.userinfo.isadmin === 0){
								_this.showLoading = false;
								_this.toastError(_this.username+'不参与评分');
								return;
							}
							
							symbinUtil.clearCookie('login');
							symbinUtil.setCookie('login',JSON.stringify(param),1);

							if(_this.checked){
								window.localStorage.setItem('wm_username',_this.username);
								window.localStorage.setItem('wm_password',_this.password);
							}else{
								window.localStorage.setItem('wm_username','');
								window.localStorage.setItem('wm_password','');
							}
						
							if(data.isadmin){
								//window.location.hash = '/periods/';
								window.location.href = window.location.href.split('#')[0]+'#/periods/'
							}else{
								//window.location.hash = '/user/';
								window.location.href = window.location.href.split('#')[0]+'#/user/'
							}
							_this.$Message.success('登录成功~');
							
							window.location.reload();
							_this.isLogined = true;
							
						}else{
							_this.toastError(data.getmsg);
						}
					}
				})
				
			},
			checkCache(){
				var username = window.localStorage.getItem('wm_username'),
					password = window.localStorage.getItem('wm_password');
				
				if(username && password){
					this.username = username;
					this.password = password;
					this.checked = true;
				}
			}
		
			

		},
		mounted(){
			this.checkCache();
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
 
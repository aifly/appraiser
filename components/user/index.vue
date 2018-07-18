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
					<Button v-if='false' type='primary' size='small'>修改头像</Button>
				</div>
				<div>
					<div>姓名：{{userinfo.username}}</div>
					<div>部门：{{userinfo.departmentname||'--'}}</div>
				</div>
				<div>
					<div>性别：{{userinfo.usersex === 0 ? '女':'男'}}</div>
					<div>职位：{{userinfo.userjob}}</div>
				</div>
				<div>
					<div>账号：{{userinfo.username}}</div>
					<div>电话：{{userinfo.usermobile||"暂无"}}  <span v-if='false' class="wm-modify-tel">修改</span></div>
				</div>
				<div>
					<div style="opacity:0">1</div>
					<div>
						<Button type="primary" @click="visible = true">修改密码</Button>
					</div>
				</div>
			</div>
		</div>

		<Modal v-model="visible" title="修改密码" @on-ok="ok" ok-text="确认" cancel-text="取消" @on-cancel="cancel" class-name="adduser-cls" :loading='isLoading'>
			<Form ref="formUser" :model="formUser"  :label-width="72" >
				<FormItem label="原始密码：" prop="username">
					<Input style="width:320px;" v-model="formUser.oldpassword" placeholder="原始密码" autocomplete="off" />
				</FormItem>

				<FormItem label="新密码：" prop="username">
					<Input style="width:320px;" v-model="formUser.newpassword" placeholder="新密码" autocomplete="off" />
				</FormItem>

				<FormItem label="确认密码：" prop="username">
					<Input style="width:320px;" v-model="formUser.surepassword" placeholder="确认密码" autocomplete="off" />
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
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				formUser:{
					oldpassword:'',
					newpassword:'',
					surepassword:''
				},
				userinfo:{}
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
			this.userinfo = symbinUtil.getUserInfo();
			if(this.userinfo.isadmin){

				window.location.hash = '/periods';
			}
		},
		
		methods:{
			ok(){
				if(this.formUser.newpassword  !== this.formUser.surepassword){
					this.$Message.error('新密码和确认密码不一致');
					return false;
				}
				var s = this;

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/modify_password',
					validate:s.validate,
					data:{
						oldpassword:s.formUser.oldpassword,
						newpassword:s.formUser.newpassword,
						surepassword:s.formUser.surepassword
					},success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
					}
				})
				
			},
			cancel(){
				this.formUser = {};
			}
		}
	}
</script>
 
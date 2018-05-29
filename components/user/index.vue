<template>
	<div class="wm-user-ui">
		<header>
			<div>我的资料</div>
		</header>
		<div>
			
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
 
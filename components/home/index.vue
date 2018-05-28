<template>
	<div class="sysbin-home-ui">
		
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import $ from 'jquery';

	export default {
		props:['obserable'],
		data(){
			return{
				tabIndex:0,
				theme2:"light",
			}
		},
		components:{
		},

		beforeCreate(){
			this.validateData = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		mounted(){

			var s =this;

			
		},
		methods:{
			tab(index){
				this.tabIndex = index;
			}
		}
	}
</script>
 
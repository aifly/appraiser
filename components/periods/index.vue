<template>
	<div class="wm-periods-ui">
		<header>
			<div>考评管理</div>
			<section>
				<Button icon='plus' @click='visible = true' type='primary'>添加</Button>
			</section>
		</header>
		<div>
			<section>
				<div v-for='(periods,i) in periodsList' :key="i" class="wm-periods-item">
					<h2>
						{{periods.periodsName}} <span>第{{i+1}}期</span>
					</h2>
					<section>
						<div>
							考评要求
						</div>
						<div>
							<span v-for='(standard ,k) in periods.checkitem' :key="k">
								{{standard}}
							</span>
						</div>
					</section>
					<footer>
						<div><span>{{periods.startdate}}</span> 至 <span>{{periods.enddate}}</span></div>
						<div>
							<span class="wm-periods-del"><Icon type="android-delete"></Icon>删除</span>
							<span class="wm-periods-edit"><Icon type="edit"></Icon>编辑</span>
						</div>
					</footer>
				</div>
			</section>
		</div>
		<Modal
			v-model="visible"
			:title="currentIndex!==-1?'编辑考评':'添加考评'"
			>
			<div class="wm-periods-dialog">
				<Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width='80' >
					<FormItem label="考评名称 ：">
						<Input v-model="formItem.periodsName" placeholder="考评名称"></Input>
					</FormItem>
					<FormItem label="开始时间 ：">
						<DatePicker v-model="formItem.startdate" format="yyyy-MM-dd" type="date" confirm placeholder="开始时间"  style="width:100%"></DatePicker>
					</FormItem>
					<FormItem label="结束时间 ：">
						<DatePicker v-model="formItem.enddate" format="yyyy-MM-dd" type="date" confirm placeholder="结束时间"  style="width:100%"></DatePicker>
					</FormItem>
					<FormItem label="是否可用 ：">
						<i-switch v-model="formItem.switch" size="large">
							<span slot="open">可用</span>
							<span slot="close">禁用</span>
						</i-switch>
					</FormItem>
				
				</Form>
			</div>
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
				imgs:window.imgs,
				visible:false,
				currentIndex:-1,
				periodsList:[],
				formItem:{
					periodsName:'',
					switch:true,
					startdate:'',
					enddate:''
				},
				ruleValidate: {
	
					periodsName: [{
	
						required: true,
	
						message: '考评名称不能为空',
	
						trigger: 'blur'
	
					}]
				}
			}
		},
		components:{
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

		},
		mounted(){
			this.getPeriodsList();
			
		},
		methods:{
			getPeriodsList(){
				$.getJSON('/components/data/periods.json',(data)=>{
					this.periodsList = data.list;
				})
			}
		}
	}
</script>
 
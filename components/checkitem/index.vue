<template>
	<div class="wm-checkitem-ui">
		<header>
			<div>评分项管理</div>
		</header>
		<div>
			<header class="wm-checkitem-header">
				<Button type="primary" icon='plus' @click="addCheckItem">新增</Button>
			</header>
			<Table :height='viewH - 64-60-62' stripe :data='dataSource' :columns='columns'></Table>
		</div>

		<Modal
			v-model="visible"
			:title="currentIndex!==-1?'编辑考评':'添加考评'"
			@on-ok='checkitemAction'
			>
			<div class="wm-periods-dialog">
				<Form ref="formItem" :model="formItem" :label-width='80' >
					<FormItem label="标题 ：">
						<Input v-model="formItem.title" placeholder="标题"></Input>
					</FormItem>
					<FormItem label="内容 ：">
						<Input :rows="5" type='textarea' v-model="formItem.itemdetial" placeholder="内容"></Input>
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
				visible:false,
				imgs:window.imgs,
				viewH:window.innerHeight,
				dataSource:[],
				currentIndex:-1,
				formItem:{

				},
				columns:[
					{
						title:"标题",
						key:"title",
						width:120,
						align:'center'
					},
					{
						title:"内容",
						key:"itemdetial",
					},
					{
						title:"操作",
						key:"",
						width:180,
						align:'center',
						render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
										icon:'edit'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
										   console.log(params.row);
											 
										   this.currentIndex = params.row.checkitemid;
                                           this.visible = true;
										   this.formItem = params.row;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
										icon:'trash-a'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeCheckItem(params.row.checkitemid,params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
					}
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
		mounted(){
			this.getCheckitemList();
		},
		
		methods:{
			removeCheckItem(checkitemid,index){
				var s = this;
				symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/delcheckitem/',
						data:{
							checkitemid
						},
						validate:s.validate,
						success(data){
							if(data.getret === 0){
								s.$Message.success('删除成功');
								s.dataSource.splice(index,1);
							}else{
								s.$Message.success('删除失败')
							}
						}
					})
			},
			addCheckItem(){
				this.currentIndex = -1;
				this.visible = true;	
			},
			checkitemAction(){
				var s = this;
				if(this.currentIndex!==-1){//编辑
				
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/editcheckitem/',
						data:{
							checkitemid:s.currentIndex,
							title:s.formItem.title,
							itemdetial:s.formItem.itemdetial
						},
						validate:s.validate,
						success(data){
							console.log(data);
						}
					})
				}else{
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadmin/addcheckitem/',
						data:{
							title:s.formItem.title,
							itemdetial:s.formItem.itemdetial
						},
						validate:s.validate,
						success(data){
							if(data.getret === 0){
								s.$Message.success('添加成功');
								s.dataSource.unshift({
									title:s.formItem.title,
									itemdetial:s.formItem.itemdetial,
									checkitemid:data.id
								});
								setTimeout(() => {
									s.formItem = {};
								}, 100);
							}else{
								s.$Message.success('添加失败')
							}
						}
					})
				}
			},
			getCheckitemList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+"/wmadmin/getcheckitemlist/",
					data:{},
					validate:s.validate,
					success(data){
						//console.log(data);
						s.dataSource = data.list;

					}
				});
			}
		}
	}
</script>
 
<template>
    <div class="layout">
        <Layout v-if='$route.name !== "login"'>
            <Header>
               <div>
                   <div class="layout-logo">
                        <img :src="imgs.logo"  />
                    </div>
                    <div class="wm-title">
                        <img :src="imgs.titleBg" alt="">
                        <span>2018年12月份考评</span>
                    </div>
               </div>
               <div class="wm-user-info">
                   <img :src='imgs.man' />
                   <span>徐畅</span>
                   <img :src="imgs.logout" alt="" class="wm-logout">
               </div>
            </Header>
            <Layout class="wm-main-layout">
                <div class="wm-tab-C" :style='{height:(viewH - 64)+"px"}'>
                    <ul>
                        <li @click='tab(0)' :class="{'active':$route.name==='user'||$route.name==='score'||$route.name==='history'}">
                            <router-link to='/user'><img :src='imgs.user' alt=""></router-link>
                        </li>
                        <li @click='tab(1)' :class="{'active':$route.name==='grade'}">
                            <router-link to='/grade'><img :src='imgs.file' alt=""></router-link>
                        </li>
                        <li @click='tab(2)' :class="{'active':$route.name==='periods'||$route.name==='adminuser'||$route.name==='checkitem'}">
                            <router-link to='/periods'><img :src='imgs.setting' alt=""></router-link>
                        </li>
                    </ul>
                </div>
                <Layout>
                   <router-view></router-view>
                </Layout>
            </Layout>
        </Layout>
        <div v-else>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
	import './index.css';
    import Vue from 'vue';
    import symbinUtil from '../lib/util';
    import sysbinVerification from '../lib/verification';

	export default {
		props:[],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
                viewH:document.documentElement.clientHeight,
                openNames:['1'],
                defaultLeftMenu:[],
                tabIndex:0,
                topMenu:[
                ],
                defaultMenu:[
                    {
                        name:'管理员设置',
                        subMenu:[
                            {
                                name:'系统管理员管理',
                                link:'/adminuser/'
                            }
                        ]
                    },{
                        name:'栏目设置',
                        subMenu:[
                            {
                                name:'后台栏目管理',
                                link:'/column/list'
                            }
                        ]
                    },{
                        name:'权限设置',
                        subMenu:[
                            {
                                name:'角色管理',
                                link:'/role/'
                            },
                            {
                                name:'权限管理',
                                link:'/purview/'
                            }
                        ]
                    }
                ],
                menus:[]
			}
		},
		components:{
		},
        beforeCreate(){
            this.validateData = sysbinVerification.validate(this);

        },
        watch:{
            $route(to){
                switch(to.name){
                    case 'rolepanel':
                        this.menus = this.defaultMenu;
                      
                    break;
                    case 'console':
                        this.menus = this.defaultLeftMenu;
                    break;
                }
               
            }
        },
		mounted(){
           ///this.menus = this.defaultMenu.concat([]);
            var obserable = Vue.obserable;
            obserable.on('fillMenu',(data)=>{
                
                this.menus = data|| [];

            })
            switch(this.$route.name){
                case 'rolepanel':
                    this.menus = this.defaultMenu;
                break;
                case 'console':
                    this.menus = this.defaultLeftMenu;
                break;

            }
            if(this.$route.name === 'login'){
                return;
            }

            var obserable = Vue.obserable;
            this.loadMenu({
                status:1,
            },(data)=>{
                
                var arr = [];

                data.list.filter(d=>{
                    return d.showwhere === 1;
                }).forEach((dt)=>{
                    this.topMenu.push({
                        name:dt.menuname,
                        link:dt.menuurl
                    })
                });
                
                data.list.filter((d)=>{return d.showwhere === 2}).forEach((menu,i)=>{
                    var children = menu.children;
                    var childArr = [];
                   if(children){
                       children.forEach(child=>{
                           childArr.push({
                               name:child.menuname,
                               link:child.menuurl+''+(child.children?child.menuid:'')
                           })
                       })
                   }
                    arr.push({
                        name:menu.menuname,
                        subMenu:childArr
                    })
                })

                this.defaultLeftMenu = arr;
                if(this.$route.name !== 'rolepanel'){
                    obserable.trigger({
                        type:'fillMenu',
                        data:arr
                    })
                }

                
            }); 



        },
       
		methods:{
            
            tab(index){
                this.tabIndex = index;
            },
           
            loadMenu(option,fn){
                var s = this;
                return;
                symbinUtil.ajax({
                    url:window.config.baseUrl+"/admin/getmenulist",
                    validate:s.validateData,
                    data:{
                        status:option.status,
                    },
                    fn(data){

                       // console.log(JSON.stringify(data));
                        
                        if(data.getret===0){

                            fn && fn(data);
                        }
                        else{
                            s.$Message.error({
                                content:data.getmsg,
                                duration: 10
                            });
                             
                        }
                        
                    }
                })
            }
		}
	}
</script>
 

 <style >
     .ivu-layout-header{
        padding: 0 !important; 
     }
     .ivu-layout{
        position: relative;
     }
 </style>
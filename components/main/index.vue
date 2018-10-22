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
                        <span>{{userinfo.periodsname}}</span>
                    </div>
               </div>
               <div class="wm-user-info">
                   <img :src='imgs.man' />
                   <span>{{userinfo.userrealname}}</span>
                   <img @click='logout' :src="imgs.logout" alt="" class="wm-logout" title='退出登录'>
               </div>
            </Header>
            <Layout class="wm-main-layout">
                <div class="wm-tab-C" :style='{height:(viewH - 64)+"px"}'>
                    <ul>
                        <li @click='tab(0)' :class="{'active':$route.name === 'user'||$route.name === 'score'||$route.name ==='history'}">
                            <router-link to='/user'><img :src='imgs.user' alt=""></router-link>
                        </li>
                        <li v-if='!userinfo.isadmin' @click='tab(1)' :class="{'active':$route.name === 'grade'}">
                            <router-link to='/grade'><img :src='imgs.file' alt=""></router-link>
                        </li>
                        <li v-if='userinfo.isadmin' @click='tab(2)' :class="{'active':$route.name === 'periods'||$route.name === 'adminuser'||$route.name==='checkitem'}">
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
                userinfo:{},
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
            
            var userinfo = symbinUtil.getUserInfo();

            this.userinfo = userinfo; 



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
            },
            logout(){
                var s = this;
                symbinUtil.ajax({
                    url:window.config.baseUrl+'/wmuser/loginout/',
                    data:{},
                    validate:s.userinfo,
                    success(data){
                        if(data.getret === 0){
                            s.$Message.success('注销成功');
                            symbinUtil.clearCookie('login');
                            window.location.hash = '/login';
                            window.sessionStorage.clear();
                        }
                    }
                });
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
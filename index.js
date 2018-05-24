import Vue from "vue";
import Obserable from './components/lib/obserable';
import Main from './components/main/index';
import Login from './components/login/index'
import Home from './components/home/index'
import Adminuser from './components/adminuser/index'
import Admin from './components/admin/index'
import Group from './components/group/index'
import User from './components/user/index'
import Order from './components/order/index'
import FError from './components/ferror/index'
import Column from './components/column/index';
import Console1 from './components/console/index';
import Hatchery from './components/hatchery/index';
import ProdutDetail from './components/productdetail/index';

import LandownerBaseInfo from './components/landownerbaseInfo/index';
import LandownerAddress from './components/landowneraddress/index';
import Repository from './components/repository/index';
import Farmer from './components/farmer/index';
import Farmer1 from './components/farmer1/index';
import Rolepanel from './components/rolepanel/index';
import Role from './components/role/index';
import Purview from './components/purview/index';
import Article from './components/article/index';
import Notice from './components/article/notice';
import Message from './components/article/message';
import iView from 'iview';
import VueRouter from 'vue-router'
import './components/css/index.css';
import './components/css/theme.css';

Vue.use(VueRouter)
Vue.use(iView)


var obserable = new Obserable();

Vue.obserable = obserable;
const router = new VueRouter({
  
  routes: [
    {path: '*', name: 'error', component: FError },
    { path: '/login/', name: 'login', component: Login, props: true },
    { path: '/', name: 'login', component: Login, props: true },
	{ path: '/home/', name: 'home', component: Home, props: true },
	{ path: '/adminuser/', name: 'adminuser', component: Adminuser, props: true },
    { path: '/console/', name: 'console', component: Console1, props: true },
	  { path: '/breed/', name: 'breed', component: Hatchery, props: true },
	  { path: '/hatchery/', name: 'hatchery', component: Hatchery, props: true },
	  {
	  	path: '/productdetail/',
	  	name: 'productdetail',
	  	component: ProdutDetail,
	  	props: true
	  },
    
    { path: '/role/', name: 'role', component: Role, props: true },
    { path: '/rolepanel/', name: 'rolepanel', component: Rolepanel, props: true },
    { path: '/purview/', name: 'purview', component: Purview, props: true},
	{ path: '/article/', name: 'article', component: Article, props: true},
	{ path: '/article/notice', name: 'article', component: Notice, props: true},
	{ path: '/article/message', name: 'article', component: Message, props: true},
    
    { path: '/group/', name: 'group', component: Group, props: true,children:[
     	{ path: '/user/', name: 'user', component: User},
     	{ path: '/order/', name: 'order', component: Order},     	
     	{ path: '/admin/:id', name: 'admin', component: Admin},
     	{ path: '/column/:id', name: 'column', component: Column},
     	{ path: '/farmer/:id', name: 'farmer', component: Farmer, props: true },
      	{ path: '/farmer1/:id', name: 'farmer1', component: Farmer1, props: true },
      	{ path: '/landownerbaseinfo/:id', name: 'landownerbaseinfo', component: LandownerBaseInfo, props: true },
      	{ path: '/landowneraddress/:id', name: 'landowneraddress', component: LandownerAddress, props: true },
      	{ path: '/repository/:id', name: 'repository', component: Repository, props: true },
    	] 
	}
  ]
});

new Vue({
	router,
	data: {
		obserable,
		imgs,
		viewH: document.documentElement.clientHeight,
	},
	el: '#app',
	template: `<div id="app1">
      <Main :obserable='obserable'></Main>
    </div>`,
	methods: {
	},
	components: {
		Main,
		Login,
		FError,
		Home,
		Group,
		User,
		Order,
		Admin,
		Adminuser,
		Column,
		Console1,
		Farmer,
		Farmer1
	},
	mounted() {

		this.$router.obserable = obserable;


	}
}).$mount('#app1')
import Vue from "vue";
import Obserable from './components/lib/obserable';
import Main from './components/main/index';
import Login from './components/login/index'
import Group from './components/group/index'
import SettingGroup from './components/settinggroup/index'
import User from './components/user/index'
import Periods from './components/periods/index'
import AdminUser from './components/adminuser/index'
import CheckItem from './components/checkitem/index'
import Score from './components/score/index'
import History from './components/history/index'
import Home from './components/home/index'
import Grade from './components/grade/index'
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
		//{path: '*', name: 'error', component: FError },
		{
			path: '/login/',
			name: 'login',
			component: Login,
			props: true
		},
		{
			path: '/',
			name: 'login',
			component: Login,
			props: true
		},
		{
			path: '/grade/',
			name: 'grade',
			component: Grade,
			props: true
		},
		{
			path: '/group/',
			name: 'group',
			component: Group,
			props: true,
			children: [{
				path: '/user/',
				name: 'user',
				component: User
			}
			]
		}, {
			path: '/group/',
			name: 'group',
			component: Group,
			props: true,
			children: [{
				path: '/score/',
				name: 'score',
				component: Score
			}]
		}, {
			path: '/group/',
			name: 'group',
			component: Group,
			props: true,
			children: [{
				path: '/history/',
				name: 'history',
				component: History
			}]
		}, {
			path: '/group/',
			name: 'group',
			component: Group,
			props: true,
			children: [{
				path: '/user/',
				name: 'user',
				component: User
			}
			]
		}, {
			path: '/group/',
			name: 'group',
			component: Group,
			props: true,
			children: [{
				path: '/score/',
				name: 'score',
				component: Score
			}]
		}, {
			path: '/group/',
			name: 'group',
			component: Group,
			props: true,
			children: [{
				path: '/history/',
				name: 'history',
				component: History
			}]
		},
		{
			path: '/settinggroup/',
			name: 'settinggroup',
			component: SettingGroup,
			props: true,
			children: [{
				path: '/periods/',
				name: 'periods',
				component: Periods
			}
			]
		},
		{
			path: '/settinggroup/',
			name: 'settinggroup',
			component: SettingGroup,
			props: true,
			children: [{
				path: '/adminuser/',
				name: 'adminuser',
				component: AdminUser
			}]
		},  {
			path: '/settinggroup/',
			name: 'settinggroup',
			component: SettingGroup,
			props: true,
			children: [{
				path: '/checkitem/',
				name: 'checkitem',
				component: CheckItem
			}]
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
	methods: {},
	components: {
		Main,
		Login,
		Home,
	},
	mounted() {

		this.$router.obserable = obserable;


	}
}).$mount('#app1')
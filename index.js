import Vue from "vue";
import Obserable from './components/lib/obserable';
import Main from './components/main/index';
import Login from './components/login/index'
import Group from './components/group/index'
import User from './components/user/index'
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
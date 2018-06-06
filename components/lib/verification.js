import symbinUtil from './util';
var sysbinVerification = {
	validate($this){
		try{
			var obj = JSON.parse(symbinUtil.getCookie('login'));
			if(obj){
				return obj.userinfo;
			}
		}catch(e){
			$this.$Message.warning('登录失效，请登录');
			setTimeout(()=>{
				//window.location.hash = '/login/';
			},300)
		}
	}
};
export default sysbinVerification;
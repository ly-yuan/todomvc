;(function (window) {
	const todos = JSON.parse(window.localStorage.getItem('todos')||"[]");

	// 初始化时，自动获取焦点
	Vue.directive('focus',{
		// 当被绑定的元素插入到 DOM 中时
		inserted:function(el){
			console.log(el)
			// 聚焦元素
			el.focus()
		}
	})
	const app = new Vue({
		el:'#todoapp',
		data:{
			todos, //任务类表数据源
			inputText:'',//用于获取添加任务文本框的数据
			currentEdit:null,//用于判断任务项是否获得editing样式的一个标记量
			backTitle:'',//用于备份编辑之前的任务项的title 编辑前先备份，取消编辑后回退
			filterTodos:[],// 取决于你点击了谁？  all completed active
			hash:''
		},
		methods:{
			// 添加功能
			addTodo(){
				// 单独拿到文本框及任务列表数据
				const {inputText,todos} = this
				// 非空校验
				if(inputText.trim().length == 0){
					return
				}
				// 设置唯一ID
				const lastItem = todos[todos.length-1]
				const id = lastItem?lastItem.id+1:1
				// 添加到数组中
				todos.push({
					id,
					title:inputText,
					done:false
				})
				// 清空文本框
				this.inputText = ''
			},
			//删除单个任务项
			removeTodo(item){
				// todos.splice(index,1)
				const index = this.todos.findIndex(t=>t.id == item.id)
				if(index !== -1){
					this.todos.splice(index,1)
				}
			},
			// 双击编辑功能
			getEditing(item){
				this.currentEdit = item
				this.backTitle = item.title
			},
			// 回车或者是去焦点保存编辑
			saveEdit(item,index){
				// 判断编辑的任务项的文本是否为空
				// 如果为空，则直接删除
				// 如果不为空，则保存编辑，去除编辑样式
				if(item.title.trim().length === 0 ){
					this.todos.splice(index,1)
				}else{
					this.currentEdit = null
				}
			},
			// ESC 取消编辑
			// 取消编辑的同时，触发了是去焦点事件
			cancelEdit(){
				this.currentEdit.title = this.backTitle
				this.currentEdit = null
			},
			// 删除所有已完成项
			clearAllDone(){
				this.todos = this.todos.filter(item=>!item.done)
	
				// const todos = this.todos
				// for (let i = 0; i < todos.length; i++) {
				// 	if (todos[i].done === true) {
				// 		// 执行删除操作
				// 		todos.splice(i, 1)

				// 		// 让索引倒退一次，防止有漏网之鱼
				// 		i--
				// 	}
				// }
			},
			// 切换所有任务项的选中状态
			// toggleAll(e){
			// 	const {checked} = e.target
			// 	this.todos.forEach(item => {
			// 		item.done = checked
			// 	});
			// }
		},
		// 使用计算属性来计算未完成任务数
		// 计算属性和方法唯一的区别是：
		// 	计算属性会把计算的结果进行缓存
		// 	如果多次使用该计算属性，实际上只调用了一次
		// 	而方式的话，每使用一次就调用一次
		// 所以在有多次使用的场景下，最好使用计算属性
		computed:{
			remaining(){
				return this.todos.filter(item=>!item.done).length
			},
			// 切换所有任务项的选中状态
			toggleAllStat:{
				get(){
					// every方法 会对每一个元素执行条件判断
					// 如果每个元素.done == true  every方法返回true
					// 只要其中某个元素.done == false  则every方法返回false
					const toggleAll = this.todos.every(item=>{
						return item.done === true
					})
					return toggleAll
				},
				set(val){
					this.todos.forEach(item => {
						item.done = val
					});
				}
			}
		},
		watch:{
			// todos(){
			// 	// 默认状态下，只能监听对象或者数组的一层数据，如果需要五级后代监视，则需要配置为深度监听
			// 	console.log('todos 发生了改变')
			// }
			todos:{
				handler:function(){
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
					window.onhashchange()
				},
				deep:true
			}
		},
		directives:{
			// 双击进入编辑状态后，自动获取焦点
			'todo-focus':{
				update(el,binding){
					if(binding.value){
						el.focus()
					}
				}
			}
		}
	})
	window.app = app
	window.onhashchange = ()=>{
		const {hash} = window.location
		app.hash = hash
		switch(hash){
			case "#/":
				app.filterTodos = app.todos
				break
			case "#/active":
				app.filterTodos = app.todos.filter((item)=>{
					return item.done === false
				})
				break
			case "#/completed":
				app.filterTodos = app.todos.filter((item)=>{
					return item.done === true
				})
				break
			default:
				app.hash = '#/'
				app.filterTodos = app.todos
				break
		}
	}
	// hash 只有在改变的时候才执行
	// 所以需要页面在第一次进来的时候，默认显示全部
	// window.location =  "#/"
	window.onhashchange()
})(window);

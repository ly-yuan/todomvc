;(function (window) {
	
	const todos = [
		{
			id:1,
			title:'吃饭',
			done:true
		},
		{
			id:2,
			title:'睡觉',
			done:false
		},
		{
			id:3,
			title:'打豆豆',
			done:true
		},
		{
			id:4,
			title:'陪老婆',
			done:false
		}
	]

	new Vue({
		el:'#todoapp',
		data:{
			todos, //任务类表数据源
			inputText:'',//用于获取添加任务文本框的数据
			currentEdit:null,//用于判断任务项是否获得editing样式的一个标记量
			backTitle:'',//用于备份编辑之前的任务项的title 编辑前先备份，取消编辑后回退
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
			removeTodo(index){
				todos.splice(index,1)
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
			}
		}
	})

})(window);

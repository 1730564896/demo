// 定义自定义指定
export const imageerror = {
// 指令对象，会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是指令中变量的解释
    // dom表示当前指令作用的dom对象
    // dom为此时的图片
    // 当图片有地址，但是地址没有加载成功，会触发图片的一个事件 =》 onerror
    dom.src = dom.src || options.value // 这是因为有的员工的头像的地址为空，给img赋值空的src不能触发错误事件，针对这一特点，我们需要对指令进行升级
    dom.onerror = function() {
      // dom可以注册error事件
      // 当图片出现异常的时候，会将指令配置的默认图片设置为该图片的内容
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}


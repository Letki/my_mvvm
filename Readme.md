# 手写mvvm双向数据绑定

### 目前实现功能
- 数据劫持,将data中数据绑定到实例vm中
- v-model
- 标签中的{{XXX}}表达式
- watcher

### 实现思路
1. 在observe.js中进行数据劫持,使用Object.defineProperty()方法重新定义data中的定义,添加set和get方法
2. 变量set方法被调用通知视图更新调用dep.notify(),get方法被调用时注册watcher监听
3. compile.js中使用fragment,将页面模板转移到内存中,在内存中将模板编译好后,再一次性放回页面去.减少回流重绘
4. 进行页面的编译,获取变量的值(注意对象的值需要递归获取),
在每次获取值之前,新建一个watcher,再在获取值后放到页面时,就可以完成将此watcher注册到dep中,替换到页面的表达式中去.

#### 未完待续呢......
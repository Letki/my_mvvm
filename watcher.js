//观察者的目的就是给需要变化的那个元素增加一个观察者,当数据变化后执行对应的方法
class Watcher{
    constructor(vm,expr,cb){
        this.vm=vm
        this.expr=expr
        this.cb=cb
        //获取旧值
        this.value=this.get() 
    }
    getVal(vm,expr){
        //获取实例上的数据 {{a.b.c.d.e}}
        expr=expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    }
    get(){
        Dep.target=this
        let value=this.getVal(this.vm,this.expr)
        //用完之后要清空
        Dep.target=null
        return value
    }
    update(){
        let newValue=this.getVal(this.vm,this.expr)
        let oldValue=this.value;
        if(newValue!=oldValue){
            this.cb(newValue);
        }
    }
}

class Dep{
    constructor(){
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>{
            watcher.update() 
        })
    }
}
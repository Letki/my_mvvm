class Observer{
    constructor(data){
        this.observe(data)
    }
    observe(data){
        //对data数据改成getter和setter
        if(!data||typeof data !="object"){
            //数据不存在或者不是对象
            return;
        }
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key])
            this.observe(data[key])//递归劫持
        })
    }
    //定义响应式
    defineReactive(obj,key,value){
        let that=this
        let dep=new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                Dep.target&&dep.addSub(Dep.target)
                return value;
            },
            set(newValue){
                if(newValue!=value){
                    //这里的this不是实例
                    that.observe(newValue)
                    value=newValue
                    dep.notify()//通知所有人数据更新
                }
            }
        })
    }
}
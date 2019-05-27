class MVVM{
    constructor(options){
        this.$el=options.el;
        this.$data=options.data;
        if(this.$el){
            //进行数据劫持
            new Observer(this.$data)
            //将数据代理到this上
            this.proxyData(this.$data)
            //进行模板编译
            new Compile(this.$el,this)
        }
    }
    proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key]=newValue
                }
            })
        })
    }
}
class Compile{
    constructor(el,vm){
        this.el=this.isElementNode(el)?el:document.querySelector(el);
        this.vm=vm;
        if(this.el){
            // 1. 先把真实的dom放到内存中,通过 fragment
            let fragment=this.node2fragment(this.el)
            // 2. 提取元素中的v-model,{{}}进行编译
            this.compile(fragment)
            // 3. 编译完的fragment返回到页面中去
            this.el.appendChild(fragment)
        }
    }

    // 辅助方法
    isElementNode(node){
        return node.nodeType===1;
    }
    isDirective(name){
        return name.includes('v-')
    }
    // 核心方法
    compileElement(node){
        let attrs=node.attributes;
        Array.from(attrs).forEach(attr=>{
            //判段属性是否包含v-
            let attrname=attr.name;
            if(this.isDirective(attrname)){
                //取到对应的值放到节点中
                let expr=attr.value;
                let [,type]=attrname.split('-')
                CompileUtil[type](node,this.vm,expr);
            }
        })
    }
    compileText(node){
        let expr=node.textContent;
        let reg=/\{\{([^}]+)\}\}/g
        if(reg.test(expr)){
            //{{a}} {{b}} {{c}}
            CompileUtil['text'](node,this.vm,expr);
        }
    }
    compile(fragment){
        let childNodes=fragment.childNodes
        Array.from(childNodes).forEach((node)=>{
            if(this.isElementNode(node)){
                //是元素节点
                //递归编译节点
                this.compileElement(node)
                this.compile(node);
            } else{
                // 是文本节点
                this.compileText(node)
            }
        })
    }
    node2fragment(el){
        // 创建文档碎片
        let fragment=document.createDocumentFragment()
        let firstChild;
        while(firstChild=el.firstChild){
            fragment.append(firstChild)
        }
        return fragment
    }
}

CompileUtil={
    getVal(vm,expr){
        //获取实例上的数据 {{a.b.c.d.e}}
        expr=expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    },
    getTextVal(vm,expr){
        return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            return this.getVal(vm,arguments[1])
        })
    },
    text(node,vm,expr){
        let updateFn=this.updater['textUpdater']
        let value=this.getTextVal(vm,expr)
        console.log(value)
        expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            new Watcher(vm, arguments[1],()=>{
                updateFn && updateFn(node,this.getTextVal(vm,expr))
            })
        })
        updateFn && updateFn(node,value)        
    },
    setVal(vm,expr,value){
        expr=expr.split('.')
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex===expr.length-1){
                return prev[next]=value
            }
            return prev[next]
        },vm.$data)
    },
    model(node,vm,expr){
        let updateFn=this.updater['modelUpdater']
        new Watcher(vm,expr,()=>{
            updateFn && updateFn(node,this.getVal(vm,expr))
        })
        //添加输入监听
        node.addEventListener('input',(e)=>{
            let newValue=e.target.value
            this.setVal(vm,expr,newValue)
        })
        updateFn && updateFn(node,this.getVal(vm,expr))
    },
    updater: {
        textUpdater(node,value){
            node.textContent=value
        },
        modelUpdater(node,value){
            node.value=value
        }
    },
}
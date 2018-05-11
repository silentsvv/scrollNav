
;(function (name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
    // 检查上下文环境是否为Node
    hasExports = typeof module !== 'undefined' && module.exports;
     
    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})('NavScroll',function () {

        /**
         * 初始化滚动插件
         * 
         * @param {any} option {
         *      navQuery(string): '[data-nav]', //querySelectorAll
         *      posQuery(string): '[data-pos]', //querySelectorAll
         *      navNode(node元素): '默认搜索[data-nav]的元素',
         *      posNode(node元素): '默认搜索[data-pos]的元素',
         *      clickFn(function): '点击菜单回调事件',
         *      initError(function): '初始化失败事件',
         *      taggleClassName: 'active' //菜单激活按钮类名,
         *      
         * }
         */
        function NavScroll(option = {}) {
            let self         = this;

            self.activeIndex = 0; //当前滚动位置(对应的激活菜单)
            self.tmpIndex    = 0; //滚动时对应的位置(对应的激活菜单)
            self.navNode     = option.navNode?option.navNode: document.querySelectorAll(option.navQuery?option.navQuery: '[data-nav]'); //菜单按钮node节点数组
            self.posNode     = option.posNode?option.posNode: document.querySelectorAll(option.posQuery?option.posQuery: '[data-pos]'); //位置元素按钮数组
            self.posArr      = []; //位置记录数组
            self.option      = option; //保存option

            self.option.taggleClassName = self.option.taggleClassName?self.option.taggleClassName:'active'; //初始化

            try {
                self._init();
            } catch (error) {
                console.log(error);
                return option.initError?option.initError():false;
            }
            
        }

        NavScroll.prototype = {
            constructor: this,
        
            /**
             * 初始化事件
             * 
             * @returns 
             */
            _init() {
                let self = this;
                if(self.posNode.length != self.navNode.length) {
                    console.error('err: 所选位置与菜单数量不匹配!')
                    return false;
                }
        
                self._initPosArr();
                self._initNavClick();
                self._initScrollEvent();
            },
        
            /**
             * 获取定位元素高度数组
             * 
             */
            _initPosArr() {
                let self = this;
        
                self.posNode.forEach((item) => {
                    let position = self._getElePosition(item);
                    self.posArr.push(position);
                })
            },
        
            /**
             * 初始化菜单按钮点击事件
             * 
             */
            _initNavClick() {
                let self = this;
        
                self.navNode.forEach((item, index) => {
                    item.onclick = () => {
                        window.scrollTo(0, self.posArr[index]);
                        //判断有没有传进事件
                        return self.option.clickFn?self.option.clickFn():false;
                    }
                })
            },
        
            /**
             * 滚动事件绑定
             * 
             */
            _initScrollEvent() {
                let self = this;
        
                window.onscroll = () => {
                    let arrIndex = 0;

                    while(document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop >= self.posArr[arrIndex]) {
                        arrIndex++;
                        self.tmpIndex = arrIndex - 1;
                    }
        
                    if(self.tmpIndex != self.activeIndex) {
                        self.activeIndex = self.tmpIndex;
        
                        self.navNode.forEach((item, index) => {
                            item.classList.remove('active');
                            if(index == arrIndex - 1) {
                                item.classList.add('active');
                            }
                        })
                    }
                }
            },
        
            /**
             * 获取距顶高度
             * 
             * @param {any} element 
             * @returns 
             */
            _getElePosition(element) {
                var topPosition = 0;
        
                while(element) {
                    topPosition += element.offsetTop;
                    element = element.offsetParent;
                }
        
                return topPosition;
            }
        }

        return NavScroll;
    }
);
    
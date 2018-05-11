
function NavScroll(option) {
    let self = this;

    self.activeIndex = 0; //当前滚动位置(对应的激活菜单)
    self.tmpIndex = 0; //滚动时对应的位置(对应的激活菜单)
    self.navNode = option?option.navNode:document.querySelectorAll('[data-nav]'); 
    self.posNode = option?option.posNode:document.querySelectorAll('[data-pos]');

    self.posArr = [];

    self._init();
}

NavScroll.prototype = {
    constructor: this,

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

    _initPosArr() {
        let self = this;

        self.posNode.forEach((item) => {
            let position = self._getElePosition(item);
            self.posArr.push(position);
        })
    },

    _initNavClick() {
        let self = this;

        self.navNode.forEach((item, index) => {
            item.onclick = () => {
                window.scrollTo(0, self.posArr[index])
            }
        })
    },

    _initScrollEvent() {
        let self = this;

        window.onscroll = () => {
            let arrIndex = 0;

            while(document.body.scrollTop >= self.posArr[arrIndex]) {
                arrIndex++;
                self.tmpIndex = arrIndex - 1;
            }

            if(self.tmpIndex != self.activeIndex) {
                console.log('change');
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

    _getElePosition(element) {
        var topPosition = 0;

        while(element) {
            topPosition += element.offsetTop;
            element = element.offsetParent;
        }

        return topPosition;
    }
}
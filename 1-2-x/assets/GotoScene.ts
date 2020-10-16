// author: http://lamyoung.com/

import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GotoScene')
export class GotoScene extends Component {
    @property
    sceneName: string = 'home';

    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.gotoScene, this);
    }

    gotoScene() {
        director.loadScene(this.sceneName);
    }
}
// 导航：https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ

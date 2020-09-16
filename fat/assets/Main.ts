import { _decorator, Component, SliderComponent, ModelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(ModelComponent)
    modelComponent: ModelComponent = null;


  
    sliderCallback(slider: SliderComponent) {
        // 回调的参数是 slider 组件，注意这种方式注册的事件，无法传递 customEventData
        this.modelComponent.getMaterial(0).setProperty('fatFactor', 0.1 * slider.progress);
    }
}


// 导航：https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ
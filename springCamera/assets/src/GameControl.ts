import { _decorator, Component, Slider, v3 } from 'cc';
import { Role } from './Role';
import { SpringCamera } from './SpringCamera';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    @property(Role)
    role: Role = null!;
    @property(SpringCamera)
    camera: SpringCamera = null!;


    private sliderCallback(slider: Slider, customEventData: string) {
        // 回调的参数是 slider 组件，注意这种方式注册的事件，无法传递 customEventData
        switch (customEventData) {
            case 'speed': {
                this.role.moveSpeed = slider.progress * 30;
                break;
            }
            case 'rotate': {
                const progress = -slider.progress + 0.5;
                if (Math.abs(progress) < 0.1) {
                    this.role.rotateSpeed = 0;
                } else {
                    this.role.rotateSpeed = progress * Math.PI * 2 / 3;
                }
                break;
            }
            case 'hDist': {
                this.camera.hDist = slider.progress * 30 + 0.01;
                break;
            }
            case 'fDist': {
                this.camera.fDist = slider.progress * 24 - 6;
                break;
            }
            case 'springConst': {
                this.camera._springConst = slider.progress * 60 + 50;
                this.camera._dampConst = this.camera._springConst * 0.5;
                break;
            }

        }
    }

    private randomRole() {
        this.role.node.setWorldPosition(v3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50));
        this.role.rotateForward(Math.random() * Math.PI * 2);
    }

}

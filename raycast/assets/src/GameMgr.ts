import { _decorator, director, Component, Node, CanvasComponent, EventTouch, CameraComponent, ModelComponent, geometry, Touch, systemEvent, SystemEventType, PhysicsSystem, LabelComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameMgr")
export class GameMgr extends Component {
    @property({ type: CameraComponent })
    readonly camera_3d: CameraComponent = null;

    @property({ type: Node })
    readonly node_volleyball: Node = null;

    @property({ type: ModelComponent })
    readonly model_basketball: ModelComponent = null;

    @property({ type: CanvasComponent })
    readonly canvas_2d: CanvasComponent = null;

    @property({ type: LabelComponent })
    readonly label_info: LabelComponent = null;

    private _ray: geometry.ray = new geometry.ray();

    onEnable() {
        this.node_volleyball.on(Node.EventType.TOUCH_START, () => {
            console.log('不可能看见我')
        }, this);

        systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onDisable() {
        systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(touch: Touch, event: EventTouch) {
        this.label_info.string = '白玉无冰'
        this.camera_3d.screenPointToRay(touch._point.x, touch._point.y, this._ray);
        //基于物理碰撞器的射线检测
        if (PhysicsSystem.instance.raycast(this._ray)) {
            const r = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < r.length; i++) {
                const item = r[i];
                if (item.collider.node.uuid == this.node_volleyball.uuid) {
                    this.label_info.string = '点了排球'
                }
            }
        }

        //基于模型的射线检测
        const rs = director.getScene().renderScene;
        if (rs.raycastSingleModel(this._ray, this.model_basketball.model)) {
            const r = rs.rayResultSingleModel;
            for (let i = 0; i < r.length; i++) {
                const item = r[i];
                if (item.node.uuid == this.model_basketball.node.uuid) {
                    this.label_info.string = '点了篮球'
                }
            }
        }

        //基于 UITransform 组件的射线检测
        const uiCamera = this.canvas_2d.camera;
        uiCamera.screenPointToRay(this._ray, touch._point.x, touch._point.y);
        if (rs.raycastAllCanvas(this._ray)) {
            const result = rs.rayResultCanvas;
            for (let i = result.length; i--;) {
                const item = result[i];
                if (item.node.uuid == this.label_info.node.uuid) {
                    this.label_info.string = '点了文字';
                }
            }
        }
    }
}


// 欢迎关注公众号【白玉无冰】
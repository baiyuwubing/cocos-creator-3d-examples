import { _decorator, Component, Node, Vec4, Vec3, director, ModelComponent, CameraComponent, systemEvent, SystemEvent, Touch, geometry, Vec2 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameMgr")
export class GameMgr extends Component {

    @property({ type: CameraComponent })
    readonly camera_3d: CameraComponent = null;

    @property(ModelComponent)
    readonly model_plane: ModelComponent = null;

    private _ray: geometry.ray = new geometry.ray();
    private _temp_v4: Vec4 = new Vec4();
    private _temp_v3: Vec3 = new Vec3();
    private _count = 0;

    start() {
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private playWaterEffect() {
        const pass = this.model_plane.material.passes[0];
        pass.setUniform(pass.getHandle(`center${this._count++ % 10}`), this._temp_v4);
        // this.model_plane.material.setProperty(`center${this._count++ % 10}`, this._temp_v4);
    }

    private onTouchStart(touch: Touch) {
        this.camera_3d.screenPointToRay(touch._point.x, touch._point.y, this._ray);
        //基于模型的射线检测
        const rs = director.getScene().renderScene;
        if (rs.raycastSingleModel(this._ray, this.model_plane.model)) {
            const r = rs.rayResultSingleModel;
            for (let i = 0; i < r.length; i++) {
                const item = r[i];
                if (item.node.uuid === this.model_plane.node.uuid) {
                    this._temp_v3.set(this._ray.o);
                    this._temp_v3 = this._temp_v3.add(this._ray.d.clone().multiplyScalar(item.distance));
                    const minPosition = item.node.worldPosition.clone().add(this.model_plane.mesh.struct.minPosition);
                    const maxPosition = item.node.worldPosition.clone().add(this.model_plane.mesh.struct.maxPosition);
                    this._temp_v4.set((this._temp_v3.x - minPosition.x) / (maxPosition.x - minPosition.x), (this._temp_v3.z - minPosition.z) / (maxPosition.z - minPosition.z), director.root.cumulativeTime, 0)
                    // console.log(minPosition, maxPosition, this._temp_v3)
                    this.playWaterEffect();
                    break;
                }
            }
        }
    }

}

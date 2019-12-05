import { _decorator, Component, Node, AnimationComponent, systemEvent, SystemEventType, Touch, EventTouch, geometry, CameraComponent, Vec3, tweenUtil, math, LabelComponent, ModelComponent, director } from "cc";
const { ccclass, property } = _decorator;


const BALL_INIT_X = 80;
const BALL_MAX_Y = 12;
const BALL_MIN_Y = 0;
const BALL_CHICKEN_X = 55;
const BALL_GAMEOVER_X = 90;
const BALL_MAX_Z = 2.5;

@ccclass("GameMgr")
export class GameMgr extends Component {

    @property(CameraComponent)
    camera: CameraComponent = null;

    @property(Node)
    node_gameover: Node = null;

    @property(Node)
    node_ball: Node = null;

    @property(ModelComponent)
    model_ball: ModelComponent = null;

    @property(Node)
    node_chicken: Node = null;

    @property(LabelComponent)
    lb_score: LabelComponent = null;

    private _node_ball_pos: math.Vec3 = new math.Vec3();
    private _turn = 1;//1-my 2-鸡儿;

    private _score = 0;

    start() {
        this._node_ball_pos = this.node_ball.position.clone();
    }

    private resetGame() {
        this._score = 0;
        this.lb_score.string = '0';
        this._turn = 1;
        this._node_ball_pos.x = BALL_INIT_X;
        this._node_ball_pos.y = BALL_MIN_Y;
        this._node_ball_pos.z = 0;
        this.node_gameover.active = false;
        this.node_ball.getComponent(AnimationComponent).play('ball_idle');
        systemEvent.on(SystemEventType.TOUCH_START, this.onClickBall, this);
    }

    private _ray = new geometry.ray();
    //自己发射
    private onClickBall(touch: Touch, event: EventTouch) {
        if (this._turn === 1 && this._node_ball_pos.x >= (BALL_INIT_X + BALL_CHICKEN_X) * 0.5) {
            this.camera.screenPointToRay(touch._point.x, touch._point.y, this._ray);
            const rs = director.getScene().renderScene;
            if (rs.raycastSingleModel(this._ray, this.model_ball.model)) {
                const r = rs.rayResultSingleModel;
                for (let i = 0; i < r.length; i++) {
                    const item = r[i];
                    if (item.node.uuid == this.model_ball.node.uuid) {
                        this.node_ball.getComponent(AnimationComponent).play('ball_my');
                        this._turn = 0;
                        tweenUtil(this._node_ball_pos)
                            .stop()
                            .to(0.5, new math.Vec3((this.node_ball.position.x + BALL_CHICKEN_X) / 2, BALL_MAX_Y * (0.8 + 0.2 * Math.random()), 0))
                            .to(0.5, new math.Vec3(BALL_CHICKEN_X, BALL_MIN_Y, 0))
                            .call(() => { this.chickenBall() })
                            .start();
                        break;
                    }
                }
            }
        }
    }

    private gameOver() {
        this.node_gameover.active = true;
        this.node_ball.getComponent(AnimationComponent).play('ball_idle');
        systemEvent.off(SystemEventType.TOUCH_START, this.onClickBall, this);
    }

    //小鸡发射
    private chickenBall() {
        this.node_ball.getComponent(AnimationComponent).play('ball_he');
        this.node_chicken.getComponent(AnimationComponent).play('chicken_jump');
        this.node_chicken.getComponent(AnimationComponent).crossFade('chicken_idle', 0.3);
        this._turn = 1;
        this.lb_score.string = `${++this._score}`;
        const targetZ = -BALL_MAX_Z + 2 * BALL_MAX_Z * Math.random();
        const time = 1 / (Math.pow(1.01, this._score));
        tweenUtil(this._node_ball_pos)
            .stop()
            .to(time, new math.Vec3((this.node_ball.position.x + BALL_INIT_X) / 2, BALL_MAX_Y * (0.8 + 0.2 * Math.random()), targetZ / 2))
            .to(time, new math.Vec3(BALL_GAMEOVER_X, BALL_MIN_Y, targetZ))
            .start();
    }

    update(deltaTime: number) {
        if (this._node_ball_pos.x >= BALL_GAMEOVER_X) {
            this.gameOver();
        }
        this.node_ball.position = this._node_ball_pos;
    }
}

// 欢迎关注【白玉无冰】公众号
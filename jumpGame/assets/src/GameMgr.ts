import { _decorator, Component, Node, Prefab, instantiate, CameraComponent, LabelComponent } from "cc";
import { RoleController } from "./RoleController";
const { ccclass, property } = _decorator;

@ccclass("GameMgr")
export class GameMgr extends Component {
    @property(CameraComponent)
    camera_game: CameraComponent = null;
    @property(Node)
    node_tree: Node = null;

    @property(Node)
    node_gameOver: Node = null;

    @property(RoleController)
    role: RoleController = null;

    @property(Prefab)
    prefab_land: Prefab = null;

    @property({ type: LabelComponent })
    public stepsLabel: LabelComponent = null;

    private _roadLength: number = 50;
    private _mapInfo: number[][] = [[], []]

    start() {
        this.role.node.on('JumpEnd', this.onPlayerJumpEnd, this);
        for (let index = 0; index < this._roadLength; index++) {
            const element: Node = instantiate(this.prefab_land);
            this.node_tree.addChild(element);
            element.setPosition(0, -0.5, 2 * index);
            this._mapInfo[index] = [];
        }
    }

    resetGame() {
        this.node_gameOver.active = false;
        this.stepsLabel.string = '0';
        for (let index = 0; index < this._roadLength; index++) {
            const element: Node = this.node_tree.children[index];
            this._mapInfo[index] = [];
            for (let index2 = 0; index2 < 10; index2++) {
                const tree = element.children[index2];
                const hasTree = index >= 2 && (Math.random() > 0.6);
                this._mapInfo[index][index2] = hasTree ? 1 : 0;
                tree.active = hasTree;
            }
        }
        this.role.resetPos();
        this.role.setInputActive(true);
    }

    onPlayerJumpEnd(moveIndex: number) {
        console.log('onPlayerJumpEnd', moveIndex)
        this.stepsLabel.string = '' + moveIndex;
        this.checkResult(moveIndex);
    }

    checkResult(moveIndex: number) {
        if (moveIndex < this._roadLength) {
            const treeIndex = Math.floor(-this.role.node.position.x + 5);
            const hasTree = this._mapInfo[moveIndex][treeIndex];
            if (hasTree === 1) {
                this.gameOver();
            }
        } else {
            this.gameOver();
        }
    }

    private gameOver() {
        this.role.setInputActive(false);
        this.node_gameOver.active = true;
    }

    update(deltaTime: number) {
        this.camera_game.node.setPosition(this.camera_game.node.position.x, this.camera_game.node.position.y, -2 + this.role.node.position.z)
    }
}

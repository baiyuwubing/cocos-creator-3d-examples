// https://mp.weixin.qq.com/s/KV7fyF0kvqqOjf01ZbqbmA
import { _decorator, Billboard, Material, Vec4, Mesh, utils, director, gfx, renderer, EffectAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BillboardHelper')
export class BillboardHelper extends Billboard {

    private _model: renderer.scene.Model = null!;
    private _material: Material = null!;
    private _uniform: Vec4 = new Vec4(1, 1, 0, 0);
    private _mesh: Mesh = null!;
    private _texture = null!;

    @property({ type: Vec4, serializable: true, step: 0.1 })
    private _tillOffset: Vec4 = new Vec4(1, 1, 0, 0);
    @property({ type: Vec4 })
    get tillOffset() {
        return this._tillOffset;
    }
    set tillOffset(val) {
        this._tillOffset = val;
        this._material.setProperty('mainTiling_Offset', this._tillOffset);
    }

    @property({ type: EffectAsset, serializable: true })
    private _effect: EffectAsset = null!;
    @property({ type: EffectAsset, serializable: true })
    get effect() {
        return this._effect;
    }
    set effect(val) {
        if (val === this._effect) return;
        this._effect = val;
        this._refreshMaterial();
    }

    private _refreshMaterial() {
        if (!this._mesh || !this._model || !this._material || !this._effect) return;

        this._material.initialize({ effectAsset: this._effect, technique: 1 });
        this._model.initSubModel(0, this._mesh.renderingSubMeshes[0], this._material!);

        this._material.setProperty('cc_size_rotation', this._uniform);
        this._material.setProperty('mainTiling_Offset', this._tillOffset);
        if (this._texture) {
            this._material.setProperty('mainTexture', this._texture);
        }
    }

    private createModel() {
        this._mesh = utils.createMesh({
            primitiveMode: gfx.PrimitiveMode.TRIANGLE_LIST,
            positions: [0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0],
            uvs: [0, 0,
                1, 0,
                0, 1,
                1, 1,
            ],
            colors: [
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1],
            attributes: [
                new gfx.Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),
                new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F),
                new gfx.Attribute(gfx.AttributeName.ATTR_COLOR, gfx.Format.RGBA8UI, true),
            ],
            indices: [0, 2, 1, 1, 2, 3],
        }, undefined, { calculateBounds: false });
        //@ts-ignore
        const model = this._model = director.root.createModel(renderer.scene.Model, this.node);
        model.node = model.transform = this.node;
        if (this._material == null) {
            this._material = new Material();
        }
        this._refreshMaterial();
    }
}


// 欢迎关注微信公众号[白玉无冰]
// https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ
/**
█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄██▀▄ ▄▄██ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄▀▀▀█▄▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀▀ ▀▄▄ ▄ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄ █ █ ▀ ▀▄█▄▀████
████▀ ▄  █▄█▀█▄█▀█  ▀▄ █ ▀ ▄▄██▀█████
████ ▄▀▄▄▀▄ █▄▄█▄ ▀▄▀ ▀ ▀ ▀▀▀▄ █▀████
████▀ ██ ▀▄ ▄██ ▄█▀▄ ██▀ ▀ █▄█▄▀█████
████   ▄██▄▀ █▀▄▀▄▀▄▄▄▄ ▀█▀ ▀▀ █▀████
████ █▄ █ ▄ █▀ █▀▄█▄▄▄▄▀▄▄█▄▄▄▄▀█████
████▄█▄█▄█▄█▀ ▄█▄   ▀▄██ ▄▄▄ ▀   ████
████ ▄▄▄▄▄ █▄██ ▄█▀  ▄   █▄█  ▄▀█████
████ █   █ █ ▄█▄ ▀  ▀▀██ ▄▄▄▄ ▄▀ ████
████ █▄▄▄█ █ ▄▄▀ ▄█▄█▄█▄ ▀▄   ▄ █████
████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄▄█▄██████
█████████████████████████████████████
█████████████████████████████████████
 */

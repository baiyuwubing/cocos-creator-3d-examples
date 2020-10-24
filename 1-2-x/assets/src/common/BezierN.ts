// author:  https://github.com/haoyuan336/cocoscreator3dBezier

import { _decorator, Vec3, v3 } from 'cc';
 
export class BezierN {
    public controllerPointList: Vec3[] = [];
    constructor(ctlPL: Vec3[]) {
        this.controllerPointList = ctlPL;
    }
    public getPointList(segmentNum: number): Vec3[] {
        //参数为细分值，细分值越大，得到的曲线越平滑
        let n = this.controllerPointList.length;
        //n为当前的曲线是n阶的
        //---------计算杨辉三角
        let aList = [1, 1];
        for (let i = 3; i < n + 1; i++) {
            let tList = [];
            for (let j = 0; j < aList.length; j++) {
                tList.push(aList[j])
            }
            aList[0] = 1;
            aList[i - 1] = 1;
            for (let t = 0; t < tList.length - 1; t++) {
                aList[t + 1] = tList[t] + tList[t + 1]
            }
        }
        //--------计算杨辉三角

        //--------计算表达式的和
        let pointList: Vec3[] = [];
        for (let j = 0; j < segmentNum; j++) {
            let t = j / segmentNum;
            //t为当前的时间，这里暂时理解为时间。
            let endPos: Vec3 = v3(0, 0, 0);
            for (let i = 0; i < n; i++) {
                //计算 a,b,c的值
                let a = aList[i];
                let b = n - 1 - i;
                let c = i;


                //根据啊，b，c的结果计算单个表达式的结果
                let value = a * Math.pow((1 - t), b) * Math.pow(t, c);

                //根据单个表达式的结果求所有表达式的和
                endPos.add(v3(this.controllerPointList[i]).multiplyScalar(value));
            }
            pointList.push(endPos);
        }
        //--------计算表达式的和
        return pointList;
    }
}
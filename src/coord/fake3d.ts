import { Coordinate, CoordinateCfg, Point } from '@antv/coord';
const THETA = Math.PI / 3;
interface Fake3DCoordCfg extends CoordinateCfg {
    theta: number
}
export class Fake3DCoord extends Coordinate {
  public readonly isFakeCube: boolean = true;
  public readonly type: string = "fakeCube";
  public readonly theta: number;

  constructor(cfg: Fake3DCoordCfg) {
    super(cfg);
    // console.log(cfg)
    this.theta = typeof cfg.theta !== 'undefined' ? cfg.theta : THETA;
    this.initial();
  }

  public initial() {
    super.initial();

    const start = this.start;
    const end = this.end;

    // this.x = {
    //   start: start.x,
    //   end: end.x / Math.sin(THETA),
    // };
    // this.y = {
    //   start: start.y,
    //   end: end.y - end.x / Math.sin(THETA),
    // };
    this.x = {
      start: start.x,
      end: end.x,
    };
    this.y = {
      start: start.y,
      end: end.y + 100,
    };
  }

  public convertPoint(point: Point) {
    let { x, y } = point;

    // 交换
    if (this.isTransposed) {
      [x, y] = [y, x];
    }
    let _x = x * Math.sin(this.theta);
    let _y = x * Math.cos(this.theta) + y;
    return {
      x: this.convertDim(_x, 'x'),
      y: this.convertDim(_y, 'y')
    };
  }

  public invertPoint(point: Point) {
    let x = this.invertDim(point.x, "x");
    let y = this.invertDim(point.y, "y");

    if (this.isTransposed) {
      [x, y] = [y, x];
    }

    return {
        x: x / Math.sin(this.theta),
        y: y - x / Math.tan(this.theta)
    };
  }
}

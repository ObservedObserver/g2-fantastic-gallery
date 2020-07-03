import React, { useRef, useEffect } from "react";
import DataSet from "@antv/data-set";

import G2, { Chart } from "@antv/g2";
import { RANBOW_CAT_SCHEME, GREEN_SCHEME, LIGHT_SCHEME, PURE_GREEN_SCHEME } from "../constrants";
import { registerCoordinate } from '@antv/coord'
import { Fake3DCoord } from '../coord/fake3d'
import { Record } from "../interfaces";

registerCoordinate('fakeCube', Fake3DCoord);
// const COLOR_SCHEME = RANBOW_CAT_SCHEME;
// const COLOR_SCHEME = GREEN_SCHEME;
const COLOR_SCHEME = PURE_GREEN_SCHEME;

const LCOLOR = "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff";

let lifeCounter = 0

function mockSeriesData(dimCode: string, meaCode: string, len: number = 20, index = 0): Record[] {
    lifeCounter++;
    let series: Record[] = [];
    series.push({
      [dimCode]: 0 + "day",
      [meaCode]: Math.round(Math.random() * 20),
    });
    for (let i = 1; i < len; i++) {
        series.push({
            [dimCode]: i + 'day',
            [meaCode]: 10 + Math.sqrt(len - i) + Math.round(Math.random() * 10 + 10) * (1 - i / len) * Math.sin(i / len * 2 * Math.PI * 3.6 + lifeCounter + index)// + lifeCounter % 2 * 20
        })
    }
    // series.push({
    //   [dimCode]: len + "day",
    //   [meaCode]: Math.round(Math.random() * 9),
    // });
    return series;
}
const dimension = 'date';
const measure = 'value';
const FakeCube: React.FC = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  const viewRefs = useRef<G2.View[]>([]);
  useEffect(() => {
    function createSingleView(vis: G2.Chart, data: Record[] ,viewIndex: number, LayerNum: number) {
      // const data = mockSeriesData(dimension, measure, 10, 0);
      // const data = mockSeriesData(dimension, measure, 10, viewIndex / LayerNum * Math.PI * 2);

      const view = vis.createView({
        region: {
          start: {
            x: 0.4,
            y: 0,
          },
          end: {
            x: 0.92,
            y: 0.92,
          },
        },
        padding: [10, 10],
      });
      view.data(data);
      view
        .line()
        .position(`${dimension}*${measure}`)
        .shape("smooth")
        .color("#a8071a")
        // .label(measure, (val: number) => ({
        //   content: Math.round(val) + "%",
        // }))
        .style({
          lineWidth: 6,
          shadowColor: "#f5222d",
          shadowBlur: 20,
          shadowOffsetX: 2,
          shaodowOffsetY: 20,
        });
      // @ts-ignore
      view.coord("fakeCube", { theta: (viewIndex / LayerNum) * Math.PI * 2 });
      view.tooltip(false);
      return view;
    }
    if (container.current) {
      const vis = new Chart({
        container: container.current,
        autoFit: true,
        height: 600,
        padding: [100, 100],
      });
      
      vis.scale({
          [measure]: {
              min: 0
          }
      })
      const LayerNum = 32;
      const data = mockSeriesData(
        dimension,
        measure,
        10,
        0
      );
      const mid = Math.floor(LayerNum / 2)
      for (let i = 0; i < mid; i++) {
        const view = createSingleView(vis, data, i, LayerNum);
        viewRefs.current.push(view);
      }
      for (let i = LayerNum - 1; i >= mid; i--) {
        const view = createSingleView(vis, data, i, LayerNum);
        viewRefs.current.push(view);
      }
      vis.render();
      chart.current = vis;
    }
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (container.current) {
        const data = mockSeriesData(
          dimension,
          measure,
          10,
          0
        );
        viewRefs.current.forEach((view, viewIndex) => {
          // const data = mockSeriesData(dimension, measure, 10, 0);
          view.changeData(data);
        });
      }
    }, 180)
    return () => {
      clearInterval(timer);
    }
  }, [])
  return <div ref={container}></div>;
};

export default FakeCube;

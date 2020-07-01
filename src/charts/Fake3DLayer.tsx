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

function mockSeriesData(dimCode: string, meaCode: string, len: number = 20): Record[] {
    let series: Record[] = [];
    for (let i = 0; i < len; i++) {
        series.push({
            [dimCode]: i + 'day',
            [meaCode]: 20 + i + Math.round(Math.random() * 60) * i / len
        })
    }
    return series;
}
const FakeCube: React.FC = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  useEffect(() => {
    if (container.current) {
      const vis = new Chart({
        container: container.current,
        autoFit: true,
        height: 600,
        padding: [100, 100],
      });
      const dimension = 'date';
      const measure = 'value';
      vis.scale({
          [measure]: {
              min: 0
          }
      })
      const LayerNum = 8;
      for (let viewIndex = 0; viewIndex < LayerNum; viewIndex++) {
          const step = 1 / 16;
          const data = mockSeriesData(dimension, measure, 20);
          const view = vis.createView({
            region: {
              start: {
                x: 0 + viewIndex * step,
                y: 0 + viewIndex * step,
              },
              end: { x: 0.72 + viewIndex * step, y: 0.72 + viewIndex * step },
            },
            padding: [10, 10],
          });
          view.data(data);
          view.area()
            .position(`${dimension}*${measure}`)
            .shape("smooth")
            .color(COLOR_SCHEME[Math.min(viewIndex, COLOR_SCHEME.length - 1)])
            .style({
                // fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                fillOpacity: 0.96,
            });
          view.coord("fakeCube");
          view.tooltip(false);
          view.axis(dimension, {
            //   title: 'hah'
          })
      }
      vis.render();
      chart.current = vis;
    }
  }, []);
  return <div ref={container}></div>;
};

export default FakeCube;

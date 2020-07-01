import React, { useRef, useEffect } from "react";
import DataSet from "@antv/data-set";

import G2, { Chart } from "@antv/g2";
import {
  RANBOW_CAT_SCHEME,
  GREEN_SCHEME,
  LIGHT_SCHEME,
  PURE_GREEN_SCHEME,
} from "../constrants";
import { registerCoordinate } from "@antv/coord";
import { Fake3DCoord, Fake3DCoordWithAngle } from "../coord/fake3d";
import { Record } from "../interfaces";

registerCoordinate("fakeCube", Fake3DCoordWithAngle(Math.PI / 4));
// const COLOR_SCHEME = RANBOW_CAT_SCHEME;
// const COLOR_SCHEME = GREEN_SCHEME;
const COLOR_SCHEME = PURE_GREEN_SCHEME;

const LCOLOR = "l(270) 0:#19078B 0.6:#C9457A 1:#F2F122";

const LCOLOR_LIST = [
  "l(270) 0:#19078B 0.6:#C9457A 1:#F2F122",
  "l(270) 0:#FAE625 0.6:#21908D 1:#440356",
  "l(270) 0:#23479C 0.6:#45B4C2 1:#DBF1B4",
];

function mockSeriesData(
  dimCode: string,
  meaCode: string,
  len: number = 20,
  start: number
): Record[] {
  let series: Record[] = [];
  for (let i = 0; i < len; i++) {
    series.push({
      [dimCode]: i + "day",
      [meaCode]: Math.round(Math.random() * 10 + 10) * Math.abs(Math.sin(2 * Math.PI / len * i) + start) + (Math.random() > 0.99 ? 60 : 0 ),
    });
  }
  return series;
}
const SpaceFacet: React.FC = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  useEffect(() => {
    if (container.current) {
      const vis = new Chart({
        container: container.current,
        autoFit: true,
        height: 1000,
        padding: [100, 100],
      });
      const dimension = "date";
      const measure = "value";
      vis.scale({
        [measure]: {
          min: 0,
        },
      });
      const facetNum = 3;
      const LayerNum = 16;
      const spaceStep = 0.31;
      for (let facetIndex = 0; facetIndex < facetNum; facetIndex++) {
          for (let viewIndex = 0; viewIndex < LayerNum; viewIndex++) {
            const step = 1 / 50;
            const data = mockSeriesData(dimension, measure, 40, Math.random() * 2 * Math.PI);
            const view = vis.createView({
              region: {
                start: {
                  x: 0 + viewIndex * step,
                  y: 0 + viewIndex * step + facetIndex * spaceStep,
                },
                end: {
                    x: 0.38 + viewIndex * step,
                    y: 0.2 + viewIndex * step + facetIndex * spaceStep
                },
              },
              padding: [10, 10],
            });
            view.data(data);
            view
              .area()
              .position(`${dimension}*${measure}`)
              .shape("smooth")
            //   .color(COLOR_SCHEME[Math.min(viewIndex, COLOR_SCHEME.length - 1)])
              .style({
                fill: LCOLOR_LIST[facetIndex % LCOLOR_LIST.length],
                fillOpacity: 0.96,
              });
            view.coord("fakeCube");
            view.tooltip(false);
          }
      }
      vis.render();
      chart.current = vis;
    }
  }, []);
  return <div ref={container}></div>;
};

export default SpaceFacet;

import React, { useRef, useEffect, useMemo } from "react";
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

// const LCOLOR = "l(180) 0:#000 0.5:#5c0011 1:#f5222d";
const LCOLOR_BASE = ["#141414", "#a8071a", "#f5222d"].reverse();


const dimension = 'date';
const measure = 'value';

interface LineChart {
    series: number[];
}
const FakeCube: React.FC<LineChart> = (props) => {
  const { series = [] } = props;
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  const viewRefs = useRef<G2.View[]>([]);

  const seriesData = useMemo<Record[]>(() => {
    return series.map((n, i) => ({
      [dimension]: i + "",
      [measure]: n,
    }));
  }, [series]);
  useEffect(() => {
    function createSingleView(vis: G2.Chart, data: Record[] ,viewIndex: number, LayerNum: number, isReverse: boolean = false) {
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
          shadowBlur: 8,
          shadowOffsetX: 2,
          shaodowOffsetY: 20,
        });
      view
        .area()
        .position(`${dimension}*${measure}`)
        .shape("smooth")
        // .color("#fa8c16")
        .style({
          fill: isReverse
            ? `l(180) 0:${LCOLOR_BASE[0]} 0.5:${LCOLOR_BASE[1]} 1:${LCOLOR_BASE[2]}`
            : `l(180) 0:${LCOLOR_BASE[2]} 0.5:${LCOLOR_BASE[1]} 1:${LCOLOR_BASE[0]}`,
          fillOpacity: 0.16,
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
      const data = seriesData;
      const mid = Math.floor(LayerNum / 2)
      for (let i = 0; i < mid; i++) {
        const view = createSingleView(vis, data, i, LayerNum, false);
        viewRefs.current.push(view);
      }
      for (let i = LayerNum - 1; i >= mid; i--) {
        const view = createSingleView(vis, data, i, LayerNum, true);
        viewRefs.current.push(view);
      }
      vis.render();
      chart.current = vis;
    }
  }, []);
  useEffect(() => {
    if (container.current && chart.current) {
      // console.log(seriesData)
      chart.current.changeData(seriesData);
    }
  }, [seriesData]);
  return <div ref={container}></div>;
};

export default FakeCube;

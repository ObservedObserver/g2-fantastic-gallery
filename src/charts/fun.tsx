import React, { useRef, useEffect } from "react";
import DataSet from "@antv/data-set";

import G2, { Chart } from "@antv/g2";
import dataSource from "../data/energy.json";
import { RANBOW_CAT_SCHEME, GREEN_SCHEME, LIGHT_SCHEME } from '../constrants';

// const COLOR_SCHEME = RANBOW_CAT_SCHEME;
// const COLOR_SCHEME = GREEN_SCHEME;
const COLOR_SCHEME = LIGHT_SCHEME;

const Radar: React.FC = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  useEffect(() => {
    if (container.current) {
      const vis = new Chart({
        container: container.current,
        autoFit: true,
        height: 800,
        padding: [30, 30]
      });

      const dataView = new DataSet().createView().source(dataSource, {
        type: "graph",
        edges: (d: any) => d.links,
      });
      dataView.transform({
        type: "diagram.sankey",
      });

      // vis.legend(false);
      vis.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      // vis.axis(false);
      vis.scale({
        x: { sync: true, nice: true },
        y: { sync: true, nice: true },
        source: { sync: true },
        target: { sync: true },
        name: { sync: true }
      });

      // edge view
      const edges = dataView.edges.map((edge: any) => {
        return {
          source: edge.source.name,
          target: edge.target.name,
          name: edge.target.name,
          x: edge.x,
          y: edge.y,
          value: edge.value,
        };
      });
      const edgeView = vis.createView();
      edgeView.data(edges);
      edgeView
        .edge()
        .position("x*y")
        .shape("arc")
        .color("name", COLOR_SCHEME)
        .tooltip(false)
        .style({
          fillOpacity: 0.9,
          strokeOpacity: 0,
          shadowColor: 'rgba(0, 0, 0, 0.29)',
          shadowBlur: 12,
          shadowOffsetX: 2,
          shaodowOffsetY: 2
        });

      // node view
      const nodes = dataView.nodes.map((node: any) => {
        return {
          x: node.x,
          y: node.y,
          name: node.name,
        };
      });
      const nodeView = vis.createView();
      nodeView.data(nodes);
      nodeView
        .polygon()
        .position("x*y")
        .color("name", COLOR_SCHEME)
        .label("name", {
          style: {
            fill: "#545454",
            textAlign: "start",
          },
          offset: 0,
          content: (obj) => {
            return "  " + obj.name;
          },
        })
        .tooltip(false)
        .style({
          stroke: null,
        });
      nodeView
        .coord("theta", {
          innerRadius: -1,
          startAngle: 0,
          endAngle: 6, //3 * Math.PI / 2,
        });
      edgeView
        .coord("theta", {
          innerRadius: -1,
          startAngle: 0,
          endAngle: 6, //3 * Math.PI / 2,
        });
      vis.render();
      chart.current = vis;
    }
  }, []);
  return <div ref={container}></div>;
};

export default Radar;

import React, { useRef, useEffect } from "react";
import DataSet from "@antv/data-set";

import G2, { Chart } from "@antv/g2";
import dataSource from '../data/earthquakes.json';
import geoJson from '../data/world.geo.json';

import { Record } from "../interfaces";


const Radar: React.FC = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  useEffect(() => {
    if (container.current) {
      const vis = new Chart({
        container: container.current,
        autoFit: true,
        height: 600,
      });

      vis.scale({
        x: { sync: true },
        y: { sync: true },
      });
      vis.coordinate("rect").reflect("y");
      vis.legend(false);
      vis.axis(false);


      // data set
      const ds = new DataSet();

      // draw the map
      const dv = ds
        .createView("back")
        .source(geoJson, {
          type: "GeoJSON",
        })
        .transform({
          type: "geo.projection",
          projection: "geoMercator",
          as: ["x", "y", "centroidX", "centroidY"],
        });
      const bgView = vis.createView();
      bgView.data(dv.rows);
      bgView.tooltip(false);
      bgView.polygon().position("x*y").style({
        fill: "#09111D",
        stroke: "#253A4B",
        lineWidth: 0.5,
        fillOpacity: 0.85,
      });

      // draw the bubble plot
      const userData = ds.createView().source(dataSource);
      userData.transform({
        type: "map",
        callback: (obj: any) => {
          const projectedCoord = dv.geoProjectPosition(
            [obj.lng * 1, obj.lat * 1],
            "geoMercator"
          );
          obj.x = projectedCoord[0];
          obj.y = projectedCoord[1];
          obj.deaths = obj.deaths * 1;
          obj.magnitude = obj.magnitude * 1;
          return obj;
        },
      });
      const pointView = vis.createView();
      pointView.data(userData.rows);
      pointView
        .point()
        .position("x*y")
        .size("deaths", [3, 30])
        .shape("circle")
        .color("magnitude", [
          "#C22E00",
          "#EC9370",
          "#FEEEE8",
          "#85C4C8",
          "#00939C",
        ])
        .style({
          fillOpacity: 0.98,
          stroke: null,
        })
        .state({
          active: {
            style: {
              lineWidth: 1,
              stroke: "#FF2F29",
            },
          },
        });
        pointView.tooltip(false)
        pointView.coord('polar')
        pointView.axis('y', {
            grid: {
                line: {
                    style: {
                        stroke: '#CBE9F5'
                    }
                }
            },
            line: {
              style: {
                  stroke: "#CBE9F5"
              }
          }
        });
        pointView.axis("x", {
          grid: {
            line: {
              style: {
                stroke: "#CBE9F5",
              },
            },
          },
          line: {
              style: {
                  stroke: "#CBE9F5"
              }
          }
        });
        bgView.coord('polar')
        vis.render();
        chart.current = vis;
    }
  }, []);
  return <div ref={container}></div>;
};

export default Radar;

import React, { useRef, useEffect } from "react";
import G2, { Chart } from "@antv/g2";
import { Record } from "../interfaces";
const fields = ["theta", "r", "color"];
// const colorRaw1 =
//   "#044641,#054A44,#064D46,#075148,#08554A,#0A584C,#0D5C4E,#0F6050,#126352,#146754,#176B56,#1A6E58,#1D7259,#21765B,#247A5C,#277D5D,#2B815F,#2F8560,#338961,#368C62,#3A9063,#3F9464,#439865,#479C66,#4C9F67,#50A367,#55A768,#5AAB68,#5EAF69,#63B269,#68B66A,#6EBA6A,#73BE6A,#78C16A,#7EC56B,#83C96B,#89CC6B,#8FD06B,#95D46B,#9BD76B,#A1DB6B,#A7DE6B,#AEE26B,#B4E66B,#BBE96B,#C1ED6B,#C8F06B,#CFF36A,#D6F76A";

const colorRaw1 =
  "#D4F46A,#C8F470,#BBF576,#AFF57C,#A3F584,#97F48B,#8AF493,#7EF39B,#72F2A3,#65F1AB,#59F0B3,#4DEEBB,#40EDC3,#35EBCA,#2AE9D1,#23E6D8,#21E4DE,#25E1E4,#2EDFE9,#39DCED,#46D8F1,#53D5F4,#5FD1F7,#6CCEF8,#78CAF9,#85C6F9,#90C2F8,#9CBDF7,#A6B9F4,#B1B4F1,#BAB0ED,#C3ABE9,#CCA6E4,#D3A2DE,#DA9DD8,#E198D1,#E694CA,#EB90C2,#EF8CBA,#F289B2,#F486AA,#F683A2,#F68199,#F67F91,#F67D89,#F47C81,#F27C79,#EF7C71,#EC7C69";
// const colorRaw2 =
//   "#F5E859,#F5E458,#F5E156,#F4DD54,#F4DA53,#F3D652,#F3D350,#F2CF4F,#F1CC4E,#F0C84D,#EFC54C,#EEC24B,#EDBE4A,#ECBB4A,#EBB749,#EAB448,#E8B148,#E7AE47,#E6AA47,#E4A746,#E3A446,#E1A146,#DF9E45,#DE9A45,#DC9745,#DA9445,#D89144,#D68E44,#D48B44,#D28844,#D08544,#CE8243,#CB7F43,#C97D43,#C77A43,#C47743,#C27442,#BF7142,#BD6F42,#BA6C42,#B86942,#B56741,#B26441,#AF6241,#AD5F41,#AA5D40,#A75B40,#A4583F,#A1563F";

const colorRaw2 =
  "#022727,#032B2A,#052F2E,#073332,#0A3736,#0D3B3A,#103F3E,#134442,#174845,#1A4C49,#1D504D,#215451,#255955,#285D59,#2C615D,#306661,#346A65,#386F69,#3D736D,#417771,#457C76,#4A807A,#4E857E,#538982,#588E86,#5D928A,#62978E,#679C92,#6CA096,#71A59A,#76A99E,#7CAEA2,#81B3A6,#86B7AA,#8CBCAE,#92C0B2,#98C5B6,#9DCABA,#A3CEBE,#A9D3C2,#AFD8C6,#B6DCCA,#BCE1CE,#C2E6D2,#C9EAD5,#CFEFD9,#D6F4DD,#DCF8E1,#E3FDE5";
const colorPool1 = colorRaw1.split(",");
const colorPool2 = colorRaw2.split(",");
colorPool2.reverse();
colorPool1.reverse();
const THETA_NUM = 28;
function mockData(start: number = 0, colorLen: number): Record[] {
  const data: Record[] = [];
  let basicSeries: Record[] = [];
  for (let i = 0; i < THETA_NUM; i++) {
    basicSeries.push({
      theta: i,
      r: 40 + Math.round(Math.random() * 20),
      color: 0 + "",
      opacity: 0,
    });
  }
  for (let c = 0; c < colorLen; c++) {
    const tmpSeries: Record[] = [];
    for (let i = 0; i < THETA_NUM; i++) {
      tmpSeries.push({
        theta: i,
        r: Math.max(
          2,
          basicSeries[i].r +
            Math.sign(Math.sin(((4 * Math.PI) / THETA_NUM) * i + start)) *
              Math.sign(0.7 - Math.random()) *
              Math.round(Math.random() * 4)
        ),
        color: c + "",
        opacity: c,
      });
    }
    basicSeries = tmpSeries;
    data.push(...tmpSeries);
  }
  return data;
}

function mockBarData(
  start: number,
  colorLen: number,
  theta_num: number = THETA_NUM
): Record[] {
  const data: Record[] = [];
  let basicSeries: Record[] = [];
  for (let i = 0; i < theta_num; i++) {
    basicSeries.push({
      theta: i + '',
      r: 40 + Math.round(Math.random() * 20),
      color: 0 + "",
      opacity: 0,
    });
  }
  for (let c = 0; c < colorLen; c++) {
    const tmpSeries: Record[] = [];
    for (let i = 0; i < theta_num; i++) {
      tmpSeries.push({
        theta: i,
        r: basicSeries[theta_num - i - 1].r + (20 + Math.round(Math.random() * 80)) * ((i + 1) / theta_num),
        color: c + "",
        opacity: c,
      });
    }
    basicSeries = tmpSeries;
    data.push(...tmpSeries);
  }
  return data;
}

const Radar: React.FC = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<G2.Chart>();
  useEffect(() => {
    if (container.current) {
      const dataSource1 = mockData(0, colorPool1.length);
      const dataSource2 = mockData(2, colorPool2.length);
      const dataSource3 = mockBarData(0, 6, 6);
      const vis = new Chart({
        container: container.current,
        autoFit: true,
        height: 600,
      });
      const view1 = vis.createView({
        region: {
          start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
          end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
        },
        padding: [20, 40], // 指定视图的留白
      });

      view1.data(dataSource1);
      view1.scale("r", {
        min: 0,
        // max: 120
      });
      view1
        .area()
        .position("theta*r")
        .color("color", colorPool1)
        .shape("smooth")
        .style({
          fields: ['opacity'],
          callback: (val) => {
            return { fillOpacity: (1 - val / colorPool1.length) ** 2 }
          }
        });
      view1.coord("polar", {
        innerRadius: 0.2,
        // radius: 0.72,
      });
      // view1.axis(false);
      view1.legend(false);

      // const view2 = vis.createView({
      //   region: {
      //     start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
      //     end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
      //   },
      //   padding: [20, 40], // 指定视图的留白
      // });

      // view2.data(dataSource2);
      // view2.scale("r", {
      //   min: 0,
      //   // max: 120
      // });
      // view2
      //   .area()
      //   .position("theta*r")
      //   .color("color", colorPool2)
      //   .shape("smooth")
      //   .style({ fillOpacity: 0.09, opacity: 0.09 });
      // view2.coord("polar", {
      //   innerRadius: 0.74,
      //   radius: 1,
      // });
      // view2.legend(false);
      // view2.axis(false)

    //   const view3 = vis.createView({
    //     region: {
    //       start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
    //       end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
    //     },
    //     padding: [20, 40], // 指定视图的留白
    //   });

    //   view3.data(dataSource3);
    //   view3
    //     .interval()
    //     .position("theta*r")
    //     .adjust({
    //       type: 'stack',
    //     })
    //     .color("color");
    //   view3.coord("theta", {
    //     innerRadius: 0.8,
    //   });
    //   view3.axis(false);
    //   view3.legend(false);

      vis.legend(false);
      vis.render();
      vis.tooltip(false);
      chart.current = vis;
    }
  }, []);
  return <div ref={container}></div>;
};

export default Radar;

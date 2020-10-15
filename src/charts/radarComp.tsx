import React, { useRef, useEffect } from 'react';
import G2, { Chart } from '@antv/g2';
import { Record } from '../interfaces';
const fields = ['theta', 'r', 'color'];
// const colorRaw1 =
//   "#044641,#054A44,#064D46,#075148,#08554A,#0A584C,#0D5C4E,#0F6050,#126352,#146754,#176B56,#1A6E58,#1D7259,#21765B,#247A5C,#277D5D,#2B815F,#2F8560,#338961,#368C62,#3A9063,#3F9464,#439865,#479C66,#4C9F67,#50A367,#55A768,#5AAB68,#5EAF69,#63B269,#68B66A,#6EBA6A,#73BE6A,#78C16A,#7EC56B,#83C96B,#89CC6B,#8FD06B,#95D46B,#9BD76B,#A1DB6B,#A7DE6B,#AEE26B,#B4E66B,#BBE96B,#C1ED6B,#C8F06B,#CFF36A,#D6F76A";

const colorRaw1 =
  "#3598CD,#3F96CC,#4894CC,#5091CB,#578FC9,#5E8DC8,#648AC7,#6A88C5,#6F85C3,#7583C1,#7A80BF,#7E7EBC,#837BBA,#8779B7,#8B76B4,#8E74B2,#9271AE,#956FAB,#986CA8,#9B6AA5,#9D67A1,#A0659E,#A2629A,#A46096,#A65E93,#A75B8F,#A8598B,#AA5787,#AB5583,#AB537F,#AC517C,#AC4F78,#AC4E74,#AC4C70,#AC4B6C,#AC4968,#AB4864,#AB4760,#AA465C,#A94559,#A84455,#A74451,#A5434E,#A4424A,#A24247,#A04243,#9E4240,#9C423D,#9A4139";
// const colorRaw2 =
//   "#F5E859,#F5E458,#F5E156,#F4DD54,#F4DA53,#F3D652,#F3D350,#F2CF4F,#F1CC4E,#F0C84D,#EFC54C,#EEC24B,#EDBE4A,#ECBB4A,#EBB749,#EAB448,#E8B148,#E7AE47,#E6AA47,#E4A746,#E3A446,#E1A146,#DF9E45,#DE9A45,#DC9745,#DA9445,#D89144,#D68E44,#D48B44,#D28844,#D08544,#CE8243,#CB7F43,#C97D43,#C77A43,#C47743,#C27442,#BF7142,#BD6F42,#BA6C42,#B86942,#B56741,#B26441,#AF6241,#AD5F41,#AA5D40,#A75B40,#A4583F,#A1563F";

const colorRaw2 =
  "#D1673F,#D3693E,#D56C3D,#D76F3D,#D9713C,#DB743B,#DD763A,#DF793A,#E17C39,#E27F38,#E48137,#E68436,#E78735,#E98A34,#EA8D33,#EB9033,#EC9332,#EE9631,#EF9930,#F09C2F,#F19F2E,#F1A22D,#F2A52C,#F3A92B,#F4AC2A,#F4AF2A,#F5B229,#F5B528,#F5B928,#F5BC27,#F6BF27,#F6C327,#F6C626,#F6C927,#F5CD27,#F5D027,#F5D328,#F4D728,#F4DA29,#F3DD2A,#F3E12C,#F2E42D,#F1E72F,#F0EB31,#EFEE33,#EEF235,#EDF537,#ECF83A,#EAFC3C";
const colorPool1 = colorRaw1.split(',')
const colorPool2 = colorRaw2.split(",");
colorPool2.reverse();
colorPool1.reverse();
const THETA_NUM = 28;
function mockData (start: number = 0, colorLen: number): Record[] {
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
                 Math.sign(Math.sin(((2 * Math.PI) / THETA_NUM) * i + start )) * Math.sign(0.7 - Math.random()) *
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

function mockBarData(start: number, colorLen: number, theta_num: number = THETA_NUM): Record[] {
  const data: Record[] = [];
  let basicSeries: Record[] = [];
  for (let i = 0; i < theta_num; i++) {
    basicSeries.push({
      theta: i,
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
        r: Math.abs(Math.sin(((4 * Math.PI) / theta_num) * i + start) * 10 + Math.round(Math.random() * 4)),
        color: c + "",
        opacity: c,
      });
    }
    basicSeries = tmpSeries;
    data.push(...tmpSeries);
  }
  return data;
}

const Radar: React.FC = props => {
    const container = useRef<HTMLDivElement>(null);
    const chart = useRef<G2.Chart>();
    useEffect(() => {
        if (container.current) {
            const dataSource1 = mockData(0, colorPool1.length);
            const dataSource2 = mockData(2, colorPool2.length);
            const dataSource3 = mockBarData(0, 2);
            const vis = new Chart({
              container: container.current,
              autoFit: true,
              height: 600
            });
            const view1 = vis.createView({
              region: {
                start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
                end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
              },
              padding: [20, 40], // 指定视图的留白
            });

            view1.data(dataSource1)
            view1.scale('r', {
                min: 0,
                // max: 120
            })
            view1
              .line()
              .position("theta*r")
              .color("color", colorPool1)
              .shape("smooth")
              .style({opacity: 0.82})
            view1.coord('polar', {
                innerRadius: 0.2,
                radius: 0.6
            })
            view1.axis(false);
            view1.legend(false);

            const view2 = vis.createView({
              region: {
                start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
                end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
              },
              padding: [20, 40], // 指定视图的留白
            });

            view2.data(dataSource2);
            view2.scale("r", {
              min: 0,
              // max: 120
            });
            view2
              .line()
              .position("theta*r")
              .color("color", colorPool2)
              .shape("smooth")
              .style({opacity: 0.4});
            view2.coord("polar", {
                innerRadius: 0.2,
                radius: 0.8
            });
            view2.legend(false);

            const view3 = vis.createView({
              region: {
                start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
                end: { x: 1, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
              },
              padding: [20, 40], // 指定视图的留白
            });

            view3.data(dataSource3);
            view3
              .interval()
              .position("theta*r")
              .adjust({
                type: "stack",
              })
              .color("color", [
                colorPool1[Math.round(2 * colorPool1.length / 7)],
                colorPool2[Math.round(4 * colorPool1.length / 7)],
              ]);
            view3.coord("polar", {
              innerRadius: 0.8,
            });
            view3.axis(false);
            view3.legend(false);

            vis.legend(false);
            vis.render();
            vis.tooltip(false);
            chart.current = vis;
        }
    }, [])
    return <div ref={container}></div>
}

export default Radar;

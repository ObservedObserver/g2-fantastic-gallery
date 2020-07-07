import React, { useRef, useEffect, useMemo } from 'react';
import G2, { Chart } from '@antv/g2';
import { GREEN_SCHEME } from '../constrants';
interface LiteRecord {
    dim: string;
    value: number;
}
interface LineChart {
    series: number[];
}

const LineChart: React.FC<LineChart> = props => {
    const { series = [] } = props;
    const container = useRef<HTMLDivElement>(null);
    const chart = useRef<G2.Chart>()
    const seriesData = useMemo<LiteRecord[]>(() => {
        return series.map((n, i) => ({
            dim: i + '',
            index: i,
            value: n
        }))//.reverse()
    }, [series])
    useEffect(() => {
        if (container.current) {
            const vis = new Chart({
                container: container.current,
                height: 400,
                width: 400,
                // autoFit: true,
                padding: [20, 20, 20, 20]
            })
            vis.data(seriesData)
            // vis.scale({
            //     value: {
            //         min: 0,
            //         max: 1600
            //     }
            // })
            vis.interval().position("dim*value")
                .size(16)
                .color("#64dfdf")
                .style({
                    shadowColor: "#80ffdb",
                    shadowBlur: 16,
                    shadowOffsetX: 2,
                    shaodowOffsetY: 20
                });
            vis.tooltip(false);
            vis.axis(false);
            vis.coord('polar', {
                innerRadius: 0.4
            })
            vis.animate(false)
            vis.legend(false);
            vis.render()
            chart.current = vis;
        }
    }, [])
    useEffect(() => {
        if (container.current && chart.current) {
            // console.log(seriesData)
            chart.current.changeData(seriesData);
        }
    }, [seriesData])
    return <div ref={container}>

    </div>
}

export default LineChart;

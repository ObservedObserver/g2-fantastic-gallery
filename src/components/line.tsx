import React, { useRef, useEffect, useMemo } from 'react';
import G2, { Chart } from '@antv/g2';
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
            value: n
        }))
    }, [series])
    useEffect(() => {
        if (container.current) {
            const vis = new Chart({
                container: container.current,
                height: 400,
                autoFit: true,
                padding: [20, 20, 20, 20]
            })
            vis.data(seriesData)
            vis.area().position('dim*value').shape('smooth').style({
                fillOpacity: 0.98
            });
            vis.tooltip(false);
            vis.axis(false);
            vis.coord('polar')
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

import React from 'react';
import { scaleTime } from 'd3-scale';
import { curveMonotoneX } from 'd3-shape';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { AreaSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { createVerticalLinearGradient, hexToRGBA } from 'react-stockcharts/lib/utils';

const AreaChart = ({ data, symbol, isNegative, width, ratio }) => {
  const gradient = {
    0: isNegative ? '#fd726a' : '#008060',
    1: isNegative ? '#fd726a' : '#1a8141',
    2: isNegative ? '#fd726a' : '#1a8141',
  };

  const canvasGradient = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA(gradient[0], 0.2) },
    { stop: 0.7, color: hexToRGBA(gradient[1], 0.4) },
    { stop: 1, color: hexToRGBA(gradient[2], 0.8) },
  ]);

  return (
    <ChartCanvas
      ratio={ratio}
      width={width}
      height={200}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      seriesName={symbol}
      data={data}
      type="svg"
      xAccessor={(d) => d.timestamp}
      xScale={scaleTime()}
    >
      <Chart id={0} yExtents={(d) => d.average}>
        <defs>
          <linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
            <stop offset="0%" stopColor={gradient[0]} stopOpacity={0.2} />
            <stop offset="70%" stopColor={gradient[1]} stopOpacity={0.4} />
            <stop offset="100%" stopColor={gradient[2]} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <XAxis axisAt="bottom" orient="bottom" ticks={6} stroke="#ffffff" opacity={0.1} tickStroke="#999fa4" />
        <YAxis axisAt="left" orient="left" ticks={6} stroke="#ffffff" opacity={0.1} tickStroke="#999fa4" />
        <AreaSeries
          yAccessor={(d) => d.average}
          fill="url(#MyGradient)"
          stroke={gradient[0]}
          strokeOpacity={0.4}
          strokeWidth={2}
          interpolation={curveMonotoneX}
          canvasGradient={canvasGradient}
        />
      </Chart>
    </ChartCanvas>
  );
};

export default fitWidth(AreaChart);

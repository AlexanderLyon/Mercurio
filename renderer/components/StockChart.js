import React from 'react';
import { scaleTime } from 'd3-scale';
import { curveMonotoneX } from 'd3-shape';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { AreaSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { createVerticalLinearGradient, hexToRGBA } from 'react-stockcharts/lib/utils';

const AreaChart = ({ data, symbol, isNegative, width, ratio, identifier }) => {
  const gradient = {
    bottom: isNegative ? hexToRGBA('#fd726a', 0.4) : hexToRGBA('#008060', 0.4),
    middle: isNegative ? hexToRGBA('#d6645d', 0.6) : hexToRGBA('#2baf7f', 0.6),
    top: isNegative ? hexToRGBA('#e9807a', 0.4) : hexToRGBA('#58ad8e', 0.4),
  };

  const canvasGradient = createVerticalLinearGradient([
    { stop: 0, color: gradient.bottom },
    { stop: 0.7, color: gradient.middle },
    { stop: 1, color: gradient.top },
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
          <linearGradient id={`MyGradient-${identifier}`} x1="0" y1="100%" x2="0" y2="0%">
            <stop offset="0%" stopColor={gradient.bottom} stopOpacity={0.2} />
            <stop offset="70%" stopColor={gradient.middle} stopOpacity={0.4} />
            <stop offset="100%" stopColor={gradient.top} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <XAxis axisAt="bottom" orient="bottom" ticks={6} stroke="#ffffff" opacity={0.1} tickStroke="#999fa4" />
        <YAxis axisAt="left" orient="left" ticks={6} stroke="#ffffff" opacity={0.1} tickStroke="#999fa4" />
        <AreaSeries
          yAccessor={(d) => d.average}
          fill={`url(#MyGradient-${identifier})`}
          stroke={gradient.bottom}
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

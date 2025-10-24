"use client";

import { colors } from "@heroui/react";
import { useMemo } from "react";
import { Area, AreaChart } from "recharts";

export interface Answer {
  id: number;
  score: number;
}

interface QuizChartProps {
  answers: Answer[];
}

function QuizChart(props: QuizChartProps) {
  const { answers } = props;
  const absoluteData = useMemo(
    () =>
      answers.map((data, index) => {
        let pontuation = data.score;
        for (let i = 0; i < index; i++) {
          pontuation += answers[i].score;
        }
        return { id: index, score: data.score, pontuation };
      }),
    [answers]
  );

  return (
    <AreaChart
      style={{
        width: "100%",
        maxHeight: "20vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={absoluteData}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <defs>
        <linearGradient id="colorPontuation" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors.green[500]} stopOpacity={0.8} />
          <stop offset="95%" stopColor={colors.green[500]} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="linear"
        dataKey="pontuation"
        stroke={colors.green[500]}
        fill="url(#colorPontuation)"
      />
    </AreaChart>
  );
}

export default QuizChart;

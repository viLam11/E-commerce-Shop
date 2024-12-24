import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 300 },
  { name: 'Group B', value: 300 }
];
const COLORS = ['#0088FE', 'white'];

export default function CustomerPie() {

    return (
      <PieChart width={200} height={400} >
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={40}
          outerRadius={70}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))} 
        </Pie>
      </PieChart>
    );
}

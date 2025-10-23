
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Pie, PieChart, Cell, Legend } from "recharts";
import type { PerformanceData } from "@/types";

interface PerformanceChartsProps {
  data: PerformanceData;
}

// Paleta de cores com melhor contraste e apelo visual
const COLORS = [
  "hsl(var(--chart-1))", 
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))", 
  "hsl(var(--chart-4))", 
  "hsl(var(--chart-5))",
  "#FFBB28", 
  "#FF8042",
  "#00C49F",
];

// Helper para renderizar rótulos customizados no gráfico de pizza
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Não renderiza o rótulo se for muito pequeno

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export function PerformanceCharts({ data }: PerformanceChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-full lg:col-span-4">
        <CardHeader>
          <CardTitle>Tendência Diária de Conclusões</CardTitle>
          <CardDescription>
            Número de solicitações e denúncias concluídas por dia no período selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
              <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar dataKey="count" name="Concluídos" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>
            Distribuição dos serviços concluídos por categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie 
                data={data.categoryDistribution} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                labelLine={false}
                label={renderCustomizedLabel}
              >
                 {data.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{fontSize: '12px'}} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Conclusões por Departamento</CardTitle>
           <CardDescription>
            Número de serviços concluídos por cada departamento da SEMEA.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={data.departmentDistribution} margin={{left: 30, right: 30}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={120} interval={0} />
                <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                <Bar dataKey="value" name="Concluídos" layout="vertical" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}

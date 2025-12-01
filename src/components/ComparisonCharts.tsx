import type { SavedSimulation } from "@/lib/storage";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonChartsProps {
  simulations: SavedSimulation[];
}

// Paleta suave e consistente para os gráficos
const COLORS = {
  ic: "#0ea5e9", // azul claro
  ta: "#22c55e", // verde
  tf: "#f97316", // laranja
  ts: "#6366f1", // azul indigo
  nf: "#ec4899", // rosa
  lambda: "#eab308", // amarelo
};

export function ComparisonCharts({ simulations }: ComparisonChartsProps) {
  if (!simulations.length) return null;

  const bySimulation = simulations.map((sim) => ({
    name: sim.name,
    IC_medio: sim.indicators.IC_medio,
    TA_medio: sim.indicators.TA_medio,
    TF_medio: sim.indicators.TF_medio,
    TS_medio: sim.indicators.TS_medio,
    lambda: sim.indicators.lambda,
    NF_medio: sim.indicators.NF_medio,
  }));

  return (
    <div className="space-y-8">
      {/* Gráfico de linhas dos tempos médios */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Evolução dos tempos médios por simulação
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Compare o comportamento de IC, TA, TF e TS ao longo das diferentes
          simulações.
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={bySimulation}
              margin={{ top: 24, right: 32, left: 0, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-18}
                textAnchor="end"
                height={50}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  borderColor: "#e5e7eb",
                  boxShadow:
                    "0 10px 15px -3px rgba(15,23,42,0.1), 0 4px 6px -4px rgba(15,23,42,0.1)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />

              <Line
                type="monotone"
                dataKey="IC_medio"
                name="IC médio"
                stroke={COLORS.ic}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="TA_medio"
                name="TA médio"
                stroke={COLORS.ta}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="TF_medio"
                name="TF médio"
                stroke={COLORS.tf}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="TS_medio"
                name="TS médio"
                stroke={COLORS.ts}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos menores para NF e λ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Tamanho médio da fila (NF)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Mostra, em média, quantos clientes ficaram na fila em cada cenário.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bySimulation}
                margin={{ top: 24, right: 24, left: 0, bottom: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-18}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e5e7eb",
                    boxShadow:
                      "0 10px 15px -3px rgba(15,23,42,0.1), 0 4px 6px -4px rgba(15,23,42,0.1)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="NF_medio"
                  name="NF médio"
                  stroke={COLORS.nf}
                  strokeWidth={2.2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Ritmo médio de chegada (λ)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Mostra quantos clientes chegam por unidade de tempo em cada
            simulação.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bySimulation}
                margin={{ top: 24, right: 24, left: 0, bottom: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-18}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e5e7eb",
                    boxShadow:
                      "0 10px 15px -3px rgba(15,23,42,0.1), 0 4px 6px -4px rgba(15,23,42,0.1)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="lambda"
                  name="λ"
                  stroke={COLORS.lambda}
                  strokeWidth={2.2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

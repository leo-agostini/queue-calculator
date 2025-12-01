import { ComparisonCharts } from "@/components/ComparisonCharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  QueueCalculator,
  QueueIndicators,
  QueueResult,
} from "@/lib/queueCalculator";
import {
  deleteSimulation,
  getSavedSimulations,
  SavedSimulation,
  saveSimulation,
} from "@/lib/storage";
import { BarChart3, Play, Save, Trash2 } from "lucide-react";
import { useState } from "react";

export function QueueSimulator() {
  const [intervalosInput, setIntervalosInput] = useState("");
  const [duracoesInput, setDuracoesInput] = useState("");
  const [results, setResults] = useState<QueueResult[]>([]);
  const [indicators, setIndicators] = useState<QueueIndicators | null>(null);
  const [simulationName, setSimulationName] = useState("");
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>(
    getSavedSimulations()
  );
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(
    null
  );
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<
    Set<string>
  >(new Set());

  const parseNumbers = (input: string): number[] => {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));
  };

  const handleSimulate = () => {
    const intervalos = parseNumbers(intervalosInput);
    const duracoes = parseNumbers(duracoesInput);

    if (intervalos.length === 0 || duracoes.length === 0) {
      alert(
        "Por favor, insira os intervalos de chegada e durações de atendimento."
      );
      return;
    }

    if (intervalos.length !== duracoes.length) {
      alert("O número de intervalos deve ser igual ao número de durações.");
      return;
    }

    try {
      const calculator = new QueueCalculator(intervalos, duracoes);
      const tabela = calculator.get_tabela();
      const indicadores = calculator.get_indicadores();

      setResults(tabela);
      setIndicators(indicadores);
      setSelectedSimulation(null);
    } catch (error) {
      alert(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  };

  const handleSave = () => {
    if (!indicators || results.length === 0) {
      alert("Execute uma simulação antes de salvar.");
      return;
    }

    const name =
      simulationName.trim() || `Simulação ${new Date().toLocaleString()}`;
    const intervalos = parseNumbers(intervalosInput);
    const duracoes = parseNumbers(duracoesInput);

    saveSimulation(name, results, indicators, intervalos, duracoes);
    setSavedSimulations(getSavedSimulations());
    setSimulationName("");
    alert("Simulação salva com sucesso!");
  };

  const handleLoadSimulation = (simulation: SavedSimulation) => {
    setIntervalosInput(simulation.intervalos.join(", "));
    setDuracoesInput(simulation.duracoes.join(", "));
    setResults(simulation.results);
    setIndicators(simulation.indicators);
    setSelectedSimulation(simulation.id);
  };

  const handleDeleteSimulation = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta simulação?")) {
      deleteSimulation(id);
      setSavedSimulations(getSavedSimulations());
      if (selectedSimulation === id) {
        setSelectedSimulation(null);
        setResults([]);
        setIndicators(null);
      }
      setSelectedForComparison((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const toggleComparison = (id: string) => {
    setSelectedForComparison((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getComparisons = () => {
    return savedSimulations.filter((sim) => selectedForComparison.has(sim.id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Simulador de Filas</h1>
        <p className="text-muted-foreground">
          Modelagem e Simulação de Sistemas
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 items-center lg:items-start">
        {/* Formulário de entrada */}
        <Card className="w-full max-w-md lg:max-w-none">
          <CardHeader>
            <CardTitle className="text-center">Dados de Entrada</CardTitle>
            <CardDescription className="text-center">
              Insira os intervalos de chegada e durações de atendimento
              (separados por vírgula)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="intervalos">Intervalos de Chegada</Label>
              <Input
                id="intervalos"
                placeholder="Ex: 2, 3, 4, 5, 6"
                value={intervalosInput}
                onChange={(e) => setIntervalosInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duracoes">Durações de Atendimento</Label>
              <Input
                id="duracoes"
                placeholder="Ex: 3, 4, 2, 5, 3"
                value={duracoesInput}
                onChange={(e) => setDuracoesInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Simulação (opcional)</Label>
              <Input
                id="name"
                placeholder="Ex: Cenário 1"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSimulate} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Simular
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                disabled={!indicators}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Indicadores */}
        {indicators && (
          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">IC Médio</p>
                  <p className="text-2xl font-bold">
                    {indicators.IC_medio.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TA Médio</p>
                  <p className="text-2xl font-bold">
                    {indicators.TA_medio.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TF Médio</p>
                  <p className="text-2xl font-bold">
                    {indicators.TF_medio.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TS Médio</p>
                  <p className="text-2xl font-bold">
                    {indicators.TS_medio.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">λ (Lambda)</p>
                  <p className="text-2xl font-bold">
                    {indicators.lambda.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NF Médio</p>
                  <p className="text-2xl font-bold">
                    {indicators.NF_medio.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Tempo Total de Simulação
                  </p>
                  <p className="text-2xl font-bold">
                    {indicators.tempo_total_simulacao.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabela de resultados */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tabela de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Intervalo</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Chegada</TableHead>
                    <TableHead>Início Atend.</TableHead>
                    <TableHead>Fim Atend.</TableHead>
                    <TableHead>Espera Fila</TableHead>
                    <TableHead>Tempo Sistema</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row.cliente}>
                      <TableCell>{row.cliente}</TableCell>
                      <TableCell>{row.intervalo.toFixed(2)}</TableCell>
                      <TableCell>{row.duracao.toFixed(2)}</TableCell>
                      <TableCell>{row.chegada.toFixed(2)}</TableCell>
                      <TableCell>{row.inicio_atendimento.toFixed(2)}</TableCell>
                      <TableCell>{row.fim_atendimento.toFixed(2)}</TableCell>
                      <TableCell>{row.espera_fila.toFixed(2)}</TableCell>
                      <TableCell>{row.tempo_sistema.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulações salvas */}
      {savedSimulations.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Simulações Salvas</CardTitle>
                  <CardDescription>
                    Clique em uma simulação para carregá-la. Marque para
                    comparar.
                  </CardDescription>
                </div>
                {selectedForComparison.size > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setComparisonMode(!comparisonMode)}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {comparisonMode ? "Ocultar" : "Mostrar"} Comparação
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedSimulation === sim.id
                        ? "bg-primary text-primary-foreground"
                        : selectedForComparison.has(sim.id)
                        ? "bg-accent border-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleLoadSimulation(sim)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedForComparison.has(sim.id)}
                          onChange={() => toggleComparison(sim.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer"
                        />
                        <div>
                          <p className="font-medium">{sim.name}</p>
                          <p className="text-xs opacity-80">
                            {new Date(sim.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSimulation(sim.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comparação de simulações */}
          {comparisonMode && selectedForComparison.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparação de Simulações</CardTitle>
                <CardDescription>
                  Visualização gráfica e tabela comparativa dos indicadores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ComparisonCharts simulations={getComparisons()} />

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicador</TableHead>
                        {getComparisons().map((sim) => (
                          <TableHead key={sim.id}>{sim.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">IC Médio</TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.IC_medio.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TA Médio</TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.TA_medio.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TF Médio</TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.TF_medio.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TS Médio</TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.TS_medio.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          λ (Lambda)
                        </TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.lambda.toFixed(4)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">NF Médio</TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.NF_medio.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Tempo Total
                        </TableCell>
                        {getComparisons().map((sim) => (
                          <TableCell key={sim.id}>
                            {sim.indicators.tempo_total_simulacao.toFixed(2)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

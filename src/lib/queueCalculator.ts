export interface QueueResult {
  cliente: number;
  intervalo: number;
  duracao: number;
  chegada: number;
  inicio_atendimento: number;
  fim_atendimento: number;
  espera_fila: number;
  tempo_sistema: number;
}

export interface QueueIndicators {
  IC_medio: number;
  TA_medio: number;
  TF_medio: number;
  TS_medio: number;
  tempo_total_simulacao: number;
  lambda: number;
  NF_medio: number;
}

export class QueueCalculator {
  private intervalos: number[];
  private duracoes: number[];
  private n: number;

  private tempos_chegada: number[] = [];
  private momentos_inicio: number[] = [];
  private momentos_fim: number[] = [];
  private tempos_espera: number[] = [];
  private tempos_sistema: number[] = [];

  private ic_medio: number = 0.0;
  private ta_medio: number = 0.0;
  private tf_medio: number = 0.0;
  private tempo_total_simulacao: number = 0.0;
  private lambd: number = 0.0;
  private nf_medio: number = 0.0;
  private ts_medio: number = 0.0;

  private _simulado: boolean = false;

  constructor(intervalos_chegada: number[], duracoes_atendimento: number[]) {
    if (intervalos_chegada.length !== duracoes_atendimento.length) {
      throw new Error(
        "Listas de intervalos e durações devem ter o mesmo tamanho."
      );
    }

    this.intervalos = intervalos_chegada;
    this.duracoes = duracoes_atendimento;
    this.n = intervalos_chegada.length;
  }

  simular(): void {
    // Tempos de chegada
    this.tempos_chegada = [];
    let tempo_acumulado = 0.0;
    for (const ic of this.intervalos) {
      tempo_acumulado += ic;
      this.tempos_chegada.push(tempo_acumulado);
    }

    // Início, fim, espera e tempo no sistema para cada cliente
    this.momentos_inicio = [];
    this.momentos_fim = [];
    this.tempos_espera = [];
    this.tempos_sistema = [];

    let fim_atendimento_anterior = 0.0;

    for (let i = 0; i < this.n; i++) {
      const chegada = this.tempos_chegada[i];
      const duracao = this.duracoes[i];

      const inicio = Math.max(chegada, fim_atendimento_anterior);
      const fim = inicio + duracao;

      const espera = inicio - chegada;
      const tempo_total = fim - chegada;

      this.momentos_inicio.push(inicio);
      this.momentos_fim.push(fim);
      this.tempos_espera.push(espera);
      this.tempos_sistema.push(tempo_total);

      fim_atendimento_anterior = fim;
    }

    // Indicadores
    this._calcular_indicadores();
    this._simulado = true;
  }

  private _calcular_indicadores(): void {
    this.ic_medio =
      this.n > 0 ? this.intervalos.reduce((a, b) => a + b, 0) / this.n : 0.0;
    this.ta_medio =
      this.n > 0 ? this.duracoes.reduce((a, b) => a + b, 0) / this.n : 0.0;
    this.tf_medio =
      this.n > 0 ? this.tempos_espera.reduce((a, b) => a + b, 0) / this.n : 0.0;
    this.ts_medio =
      this.n > 0
        ? this.tempos_sistema.reduce((a, b) => a + b, 0) / this.n
        : 0.0;

    this.tempo_total_simulacao =
      this.momentos_fim.length > 0
        ? this.momentos_fim[this.momentos_fim.length - 1]
        : 0.0;

    if (this.tempo_total_simulacao > 0) {
      this.lambd = this.n / this.tempo_total_simulacao;
    } else {
      this.lambd = 0.0;
    }

    // NF = λ * TF
    this.nf_medio = this.lambd * this.tf_medio;
  }

  get_tabela(): QueueResult[] {
    if (!this._simulado) {
      this.simular();
    }

    const tabela: QueueResult[] = [];
    for (let i = 0; i < this.n; i++) {
      tabela.push({
        cliente: i + 1,
        intervalo: this.intervalos[i],
        duracao: this.duracoes[i],
        chegada: this.tempos_chegada[i],
        inicio_atendimento: this.momentos_inicio[i],
        fim_atendimento: this.momentos_fim[i],
        espera_fila: this.tempos_espera[i],
        tempo_sistema: this.tempos_sistema[i],
      });
    }
    return tabela;
  }

  get_indicadores(): QueueIndicators {
    if (!this._simulado) {
      this.simular();
    }

    return {
      IC_medio: this.ic_medio,
      TA_medio: this.ta_medio,
      TF_medio: this.tf_medio,
      TS_medio: this.ts_medio,
      tempo_total_simulacao: this.tempo_total_simulacao,
      lambda: this.lambd,
      NF_medio: this.nf_medio,
    };
  }
}

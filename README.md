# Simulador de Filas - Modelagem e Simulação de Sistemas

Sistema web para cálculo e simulação de filas, desenvolvido com React, TypeScript e shadcn/ui.

## Funcionalidades

- ✅ Simulação de filas com intervalos de chegada e durações de atendimento
- ✅ Cálculo automático de indicadores de performance:
  - IC Médio (Intervalo de Chegada Médio)
  - TA Médio (Tempo de Atendimento Médio)
  - TF Médio (Tempo de Espera na Fila Médio)
  - TS Médio (Tempo no Sistema Médio)
  - λ (Lambda - Ritmo Médio de Chegada)
  - NF Médio (Número Médio na Fila - Lei de Little)
- ✅ Tabela detalhada de funcionamento para cada cliente
- ✅ Salvamento de simulações no localStorage
- ✅ Comparação de diferentes simulações
- ✅ Interface moderna e responsiva com shadcn/ui

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5173` no navegador

## Como Usar

1. **Inserir Dados**: 
   - Digite os intervalos de chegada separados por vírgula (ex: `2, 3, 4, 5, 6`)
   - Digite as durações de atendimento separadas por vírgula (ex: `3, 4, 2, 5, 3`)
   - O número de intervalos deve ser igual ao número de durações

2. **Simular**: 
   - Clique no botão "Simular" para executar a simulação
   - Os resultados aparecerão na tabela e os indicadores serão calculados

3. **Salvar Simulação**:
   - (Opcional) Dê um nome à simulação
   - Clique em "Salvar" para armazenar no localStorage

4. **Comparar Simulações**:
   - As simulações salvas aparecerão na seção "Simulações Salvas"
   - Clique em uma simulação para carregá-la e comparar com outras

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/          # Componentes shadcn/ui
│   └── QueueSimulator.tsx  # Componente principal
├── lib/
│   ├── queueCalculator.ts   # Lógica de simulação
│   ├── storage.ts          # Gerenciamento do localStorage
│   └── utils.ts            # Utilitários
├── App.tsx
├── main.tsx
└── index.css
```

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React (ícones)

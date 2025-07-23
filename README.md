# step-strategy-matrix

Ação customizada do GitHub Actions que simula uma matriz de execução de comandos para diferentes ambientes, permitindo executar um comando para cada item de uma lista (matrix) de ambientes.

## Descrição

Esta ação permite executar um comando para cada ambiente definido em uma matriz, substituindo a variável `{{ matrix.environment }}` pelo valor correspondente. Útil para cenários onde se deseja simular a estratégia de matrix jobs do GitHub Actions, mas de forma customizada.

## Inputs

- `matrix` (obrigatório): Lista de ambientes em formato JSON. Exemplo: `["DEV", "HOM"]`
- `command` (obrigatório): Comando a ser executado. Use `{{ matrix.environment }}` para interpolar o valor do ambiente.

## Outputs

- `result`: Resultado extraído da comparação (detalhes podem ser customizados conforme implementação).

## Exemplo de uso

```yaml
- name: Executar matrix customizada
  uses: actions/step-strategy-matrix@v1
  with:
    matrix: '["DEV", "HOM"]'
    command: 'echo Ambiente: {{ matrix.environment }}'
```

## Requisitos

- Node.js >= 20

## Scripts úteis

- `npm run build`: Compila e empacota a ação.
- `npm run dev`: Compila e executa localmente.

## Licença

MIT
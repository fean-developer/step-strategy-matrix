import * as core from "@actions/core";
import { exec } from "child_process";

async function run() {
  try {
    // Obtém os inputs
    const matrixInput = core.getInput("matrix", { required: true });
    const command = core.getInput("command", { required: true });

    // Converte JSON para array
    const matrix: string[] = JSON.parse(matrixInput);

    if (!Array.isArray(matrix)) {
      throw new Error("O input 'matrix' deve ser um array JSON.");
    }

    // Armazena os erros encontrados
    const errors: string[] = [];

    // Itera sobre os ambientes e executa o comando para cada um
    for (const env of matrix) {
      const finalCommand = command.replace(/\${environment}/g, env);

      await new Promise<void>((resolve) => {
        exec(finalCommand, (error, stdout, stderr) => {
          // Exibe a saída padrão (stdout) e a saída de erro (stderr)
          if (stdout) {
            core.info(`Executando matrix[${env}]:\n${stdout}`);
          }
          if (stderr) {
            core.error(`Erro do comando (${env}):\n${stderr}`);
          }

          if (error) {
            // Armazena o erro, mas não interrompe a execução
            errors.push(env);
          }

          resolve();
        });
      });
    }

    // Lança os erros acumulados, se houver
    if (errors.length > 0) {
      throw new Error(`Foram encontrados erros durante a execução:\n${errors.join("\n")}`);
    }
  } catch (error) {
    // Captura e exibe o erro
    core.setFailed(`${error instanceof Error ? error.message : ''}`);
  }
}

run();

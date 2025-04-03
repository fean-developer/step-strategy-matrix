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

    core.info(`Executando para ambientes: ${matrix.join(", ")}`);

    // Itera sobre os ambientes e executa o comando para cada um
    for (const env of matrix) {
      const finalCommand = command.replace(/\$AMBIENTE/g, env);

      core.info(`Executando comando para: ${env}`);
      core.info(`Comando: ${finalCommand}`);

      await new Promise<void>((resolve, reject) => {
        exec(finalCommand, (error, stdout, stderr) => {
          if (error) {
            core.error(`Erro ao executar ${env}: ${stderr}`);
            reject(error);
            return;
          }
          core.info(`Saída (${env}): ${stdout}`);
          resolve();
        });
      });
    }

    core.info("Execução concluída!");
  } catch (error: any) {
    core.setFailed(`Erro: ${error.message}`);
  }
}

run();

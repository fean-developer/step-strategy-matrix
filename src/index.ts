import * as core from "@actions/core";
import { exec } from "child_process";

async function run() {
    // Obtém os inputs
    const matrixInput = core.getInput("matrix", { required: true });
    const command = core.getInput("command", { required: true });

    // Converte JSON para array
    const matrix: string[] = JSON.parse(matrixInput);

    if (!Array.isArray(matrix)) {
      throw new Error("O input 'matrix' deve ser um array JSON.");
    }

    // Itera sobre os ambientes e executa o comando para cada um
    for (const env of matrix) {
      const finalCommand = command.replace(/\${environment}/g, env);

      await new Promise<void>((resolve) => {
        exec(finalCommand, ( stdout) => {
        //   if (error) {
        //     core.error(`Erro ao executar ${env}: ${stderr}`);
        //     reject(error);
        //     return;
        //   }
          core.info(`${stdout}`);
          resolve();
        });
      });
    }
}

run();

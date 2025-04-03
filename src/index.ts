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
    
      await new Promise<void>((resolve, reject) => {
        exec(finalCommand, (error, stdout, stderr) => {
          // Exibe a saída padrão (stdout) e a saída de erro (stderr)
          if (stdout) {
            core.info(`Saída do comando (${env}):\n${stdout}`);
          }
          if (stderr) {
            core.error(`Erro do comando (${env}):\n${stderr}`);
          }
    
          if (error) {
            // Rejeita a Promise com uma mensagem personalizada, sem incluir o comando
            reject();
            return;
          }
    
          resolve();
        });
      });
    }
  
}

run();

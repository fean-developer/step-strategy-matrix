import * as core from "@actions/core";
import { exec } from "child_process";
import * as yaml from "js-yaml";

async function run() {
  try {
    // Obtém os inputs
    const matrixInput = core.getInput("matrix", { required: true });
    const commandTemplate = core.getInput("command", { required: true });

    // Converte YAML para objeto JSON
    const matrix = yaml.load(matrixInput) as Record<string, string[]>;

    if (typeof matrix !== "object" || Array.isArray(matrix)) {
      throw new Error("O input 'matrix' deve ser um objeto YAML válido.");
    }

    // Obtém os valores da matriz
    const environments = matrix.environment || [];
    
    if (environments.length === 0) {
      throw new Error("Nenhum valor encontrado para 'matrix.environment'");
    }

    core.info(`Executando para os ambientes: ${JSON.stringify(environments)}`);

    // Itera sobre cada ambiente e executa o comando correspondente
    for (const env of environments) {
      // Substitui manualmente `${{ matrix.environment }}` pelo valor correto
     const pattern = '{{\s*matrix.environment\s*}}'
     const found = commandTemplate.search(pattern);
     core.info(`Found: ${found}`);

      let finalCommand = commandTemplate.replace(pattern, env);

      core.info(`Executando comando: ${finalCommand}`);

      await new Promise<void>((resolve, reject) => {
        exec(finalCommand, (error, stdout, stderr) => {
          if (error) {
            core.error(`Erro ao executar: ${stderr}`);
            reject(error);
            return;
          }
          core.info(`Saída: ${stdout}`);
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

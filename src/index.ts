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

    // Gera todas as combinações possíveis dos valores
    const keys = Object.keys(matrix);
    const valuesArray: any = Object.values(matrix);

    const combinations: Record<string, string>[] = [];

    function generateCombinations(index = 0, current: Record<string, string> = {}) {
      if (index === keys.length) {
        combinations.push({ ...current });
        return;
      }
      const key: any = keys[index];
      for (const value of valuesArray[index]) {
        current[key] = value;
        generateCombinations(index + 1, current);
      }
    }

    generateCombinations();

    core.info(`Executando para combinações: ${JSON.stringify(combinations, null, 2)}`);

    // Itera sobre as combinações e executa o comando correspondente
    for (const combo of combinations) {
      let finalCommand = commandTemplate;


      // Substitui os placeholders no comando
      for (const key in combo) {
        const placeholderRegex = new RegExp(`\\$\\{\\{\\s*matrix\\.${key}\\s*\\}\\}`, "g");
        console.log(`Substituindo \${{ matrix.${key} }} por ${combo[key]}`);
        finalCommand = finalCommand.replace(placeholderRegex, combo[key] as string);
        console.log(`Comando após substituição: ${finalCommand}`);
      }

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

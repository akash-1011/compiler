const { exec } = require("child_process");


const executeCpp = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filepath} && ./a.out`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
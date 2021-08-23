var readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = (prompt) => new Promise((resolve) => {
    rl.question(prompt, value => {
        resolve(value);
    });
});

const hiddenInput = (prompt) => new Promise((resolve) => {
    rl.stdoutMuted = true;
    const initialWriteToOutput = rl._writeToOutput;

    rl.question(prompt, value => {
        rl.stdoutMuted = false;
        if(!value.startsWith('0x')){
            value = `0x${value}`;
        }
        rl._writeToOutput = initialWriteToOutput;
        resolve(value);
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted && !stringToWrite.includes("\n"))
          rl.output.write("*");
        else
          rl.output.write(stringToWrite);
      };
});

module.exports = {
    input,
    hiddenInput
};
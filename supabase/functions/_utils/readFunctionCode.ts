const fs = require('fs');
const path = require('path');

export const readFunctionCode = (functionName: string): string => {
  const functionPath = path.join(__dirname, '..', functionName, 'index.ts');
  return fs.readFileSync(functionPath, 'utf8');
};

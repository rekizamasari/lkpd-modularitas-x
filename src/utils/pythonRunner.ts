/**
 * Python execution simulator and autograder for high school Python topics.
 * Handles function definitions, parameters, return values, control flow,
 * loops, math, f-strings, triple-quoted strings, chained comparisons,
 * ternary conditionals, and test case verification in a secure browser environment.
 */

import { TestCase, TestResult } from '../types/lkpd';

export interface RunResult {
  success: boolean;
  stdout: string;
  returnValue?: any;
  error?: string;
  functionsDefined: string[];
}

/**
 * Transpiles simple Python 3 functions & scripts into executable JavaScript.
 */
export function transpilePythonToJS(rawPythonCode: string): string {
  // 1. Extract multiline triple-quoted strings into placeholders
  const stringLiterals: string[] = [];
  let code = rawPythonCode.replace(/(?:f)?("""|''')([\s\S]*?)\1/g, (match, _quote, content) => {
    const isFString = match.startsWith('f');
    let processed = content;
    if (isFString) {
      processed = processed.replace(/\{([^}]+)\}/g, (_m: string, expr: string) => {
        let cleanExpr = expr.trim();
        if (cleanExpr.endsWith(':,') || cleanExpr.endsWith(':,d')) {
          cleanExpr = cleanExpr.replace(/:\,?d?$/, '');
          return `\${Number(${cleanExpr}).toLocaleString('id-ID')}`;
        }
        if (cleanExpr.includes(':.2f')) {
          cleanExpr = cleanExpr.replace(':.2f', '');
          return `\${Number(${cleanExpr}).toFixed(2)}`;
        }
        return `\${${cleanExpr}}`;
      });
    }
    const escaped = processed.replace(/`/g, '\\`');
    const token = `__STR_LITERAL_${stringLiterals.length}__`;
    stringLiterals.push(`\`${escaped}\``);
    return token;
  });

  const lines = code.split(/\r?\n/);
  const outLines: string[] = [];
  const indentStack: number[] = [0];
  let bracketDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for comments or empty lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Measure indentation (only if not inside multiline array/dict bracket)
    const indentMatch = rawLine.match(/^(\s*)/);
    const indentLevel = indentMatch ? indentMatch[1].replace(/\t/g, '    ').length : 0;
    const currentTop = indentStack[indentStack.length - 1];

    if (bracketDepth === 0) {
      if (indentLevel > currentTop) {
        indentStack.push(indentLevel);
      } else if (indentLevel < currentTop) {
        while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indentLevel) {
          indentStack.pop();
          outLines.push('}');
        }
      }
    }

    let line = trimmed;

    // Remove inline comment (if not inside string literal placeholder)
    if (line.includes('#') && !line.includes('__STR_LITERAL_')) {
      const parts = line.split('#');
      line = parts[0].trim();
    }

    // Replace single-line f-strings: f"..." or f'...'
    line = line.replace(/f(["'])(.*?)\1/g, (_match, _quote, content) => {
      const interpolated = content.replace(/\{([^}]+)\}/g, (_m: string, expr: string) => {
        let cleanExpr = expr.trim();
        if (cleanExpr.endsWith(':,') || cleanExpr.endsWith(':,d')) {
          cleanExpr = cleanExpr.replace(/:\,?d?$/, '');
          return `\${Number(${cleanExpr}).toLocaleString('id-ID')}`;
        }
        if (cleanExpr.includes(':.2f')) {
          cleanExpr = cleanExpr.replace(':.2f', '');
          return `\${Number(${cleanExpr}).toFixed(2)}`;
        }
        return `\${${cleanExpr}}`;
      });
      return `\`${interpolated}\``;
    });

    // Replace Python operators and constants
    line = line
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\s+/g, '!')
      .replace(/\/\//g, ' / ');

    // Track brackets [ and {
    for (const ch of line) {
      if (ch === '[' || ch === '{') bracketDepth++;
      else if (ch === ']' || ch === '}') bracketDepth--;
    }

    // Check for `def function_name(args):`
    const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*:/);
    if (defMatch) {
      const funcName = defMatch[1];
      const rawParams = defMatch[2];
      const cleanParams = rawParams
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
          if (p.includes('=')) {
            const [paramName, defaultVal] = p.split('=').map((s) => s.trim());
            return `${paramName} = ${defaultVal}`;
          }
          return p;
        })
        .join(', ');

      outLines.push(`function ${funcName}(${cleanParams}) {`);
      continue;
    }

    // Check for `if ...:`
    const ifMatch = line.match(/^if\s+(.+)\s*:/);
    if (ifMatch) {
      outLines.push(`if (${cleanCondition(ifMatch[1])}) {`);
      continue;
    }

    // Check for `elif ...:`
    const elifMatch = line.match(/^elif\s+(.+)\s*:/);
    if (elifMatch) {
      outLines.push(`} else if (${cleanCondition(elifMatch[1])}) {`);
      continue;
    }

    // Check for `else:`
    if (line.match(/^else\s*:/)) {
      outLines.push(`} else {`);
      continue;
    }

    // Check for `for x in range(...):`
    const forRangeMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\)\s*:/);
    if (forRangeMatch) {
      const varName = forRangeMatch[1];
      const rangeArgs = forRangeMatch[2].split(',').map((s) => s.trim());
      if (rangeArgs.length === 1) {
        outLines.push(`for (let ${varName} = 0; ${varName} < (${rangeArgs[0]}); ${varName}++) {`);
      } else if (rangeArgs.length === 2) {
        outLines.push(`for (let ${varName} = (${rangeArgs[0]}); ${varName} < (${rangeArgs[1]}); ${varName}++) {`);
      } else {
        outLines.push(`for (let ${varName} = (${rangeArgs[0]}); ${varName} < (${rangeArgs[1]}); ${varName} += (${rangeArgs[2]})) {`);
      }
      continue;
    }

    // Check for `for item in list:`
    const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.+)\s*:/);
    if (forInMatch) {
      const varName = forInMatch[1];
      const iter = forInMatch[2];
      outLines.push(`for (const ${varName} of (${iter})) {`);
      continue;
    }

    // Check for `while ...:`
    const whileMatch = line.match(/^while\s+(.+)\s*:/);
    if (whileMatch) {
      outLines.push(`while (${cleanCondition(whileMatch[1])}) {`);
      continue;
    }

    // Check for return
    const returnMatch = line.match(/^return\s+(.+)$/);
    if (returnMatch) {
      let retVal = returnMatch[1].trim();

      const retTernary = retVal.match(/^(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/);
      if (retTernary) {
        retVal = `(${cleanCondition(retTernary[2])} ? ${retTernary[1]} : ${retTernary[3]})`;
      }

      if (isTupleReturn(retVal)) {
        outLines.push(`return [${retVal}];`);
      } else {
        outLines.push(`return ${retVal};`);
      }
      continue;
    }

    // Python tuple unpacking: a, b = fn(...)
    const tupleUnpack = line.match(/^([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
    if (tupleUnpack) {
      const v1 = tupleUnpack[1];
      const v2 = tupleUnpack[2];
      const rhs = tupleUnpack[3];
      outLines.push(`var [${v1}, ${v2}] = ${rhs};`);
      continue;
    }

    // If line is opening or continuing a multiline list/dict, don't force var or ;
    if (bracketDepth > 0 && !line.includes('=')) {
      outLines.push(line);
      continue;
    }

    // Normal assignment: ensure variable declaration exists
    const assignMatch = line.match(/^([a-zA-Z0-9_]+)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const op = assignMatch[2];
      let expr = assignMatch[3].replace(/;$/, '').trim();

      const assignTernary = expr.match(/^(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/);
      if (assignTernary) {
        expr = `(${cleanCondition(assignTernary[2])} ? ${assignTernary[1]} : ${assignTernary[3]})`;
      }

      // If expr is opening a multiline bracket like `[`, don't put `;` yet
      if (expr === '[' || expr === '{') {
        outLines.push(`var ${varName} = ${expr}`);
      } else if (op === '=') {
        outLines.push(`var ${varName} = ${expr};`);
      } else {
        outLines.push(`if (typeof ${varName} === "undefined") { var ${varName} = 0; } ${varName} ${op} ${expr};`);
      }
      continue;
    }

    // Function call line with named arguments (e.g. fn(a, b, is_member=True))
    const callMatch = line.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    if (callMatch) {
      const funcName = callMatch[1];
      const callArgs = callMatch[2]
        .split(',')
        .map((arg) => {
          const a = arg.trim();
          if (a.includes('=')) {
            return a.split('=')[1].trim();
          }
          return a;
        })
        .join(', ');
      outLines.push(`${funcName}(${callArgs});`);
      continue;
    }

    outLines.push(`${line};`);
  }

  // Close remaining indentation blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    outLines.push('}');
  }

  let finalJS = outLines.join('\n');

  // Restore string literals
  for (let i = 0; i < stringLiterals.length; i++) {
    finalJS = finalJS.replace(new RegExp(`__STR_LITERAL_${i}__`, 'g'), () => stringLiterals[i]);
  }

  return finalJS;
}

function cleanCondition(cond: string): string {
  let c = cond.trim();

  // Python chained comparison: a op1 b op2 c (e.g., 1 <= jumlah <= batas_maksimal)
  const chainedMatch = c.match(/^([a-zA-Z0-9_.]+)\s*(<=|<|>=|>|==|!=)\s*([a-zA-Z0-9_.]+)\s*(<=|<|>=|>|==|!=)\s*([a-zA-Z0-9_.]+)$/);
  if (chainedMatch) {
    const [, a, op1, b, op2, third] = chainedMatch;
    c = `(${a} ${op1} ${b} && ${b} ${op2} ${third})`;
  }

  c = c.replace(/\bis\s+not\s+None\b/g, '!== null && !== undefined');
  c = c.replace(/\bis\s+None\b/g, '=== null || === undefined');
  c = c.replace(/\bis\s+/g, '=== ');

  return c;
}

function isTupleReturn(str: string): boolean {
  if (str.startsWith('[') || str.startsWith('{') || (str.startsWith('(') && str.endsWith(')'))) {
    return false;
  }
  let parenDepth = 0;
  let bracketDepth = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth--;
    else if (ch === '[') bracketDepth++;
    else if (ch === ']') bracketDepth--;
    else if (ch === ',' && parenDepth === 0 && bracketDepth === 0) {
      return true;
    }
  }
  return false;
}

export function executePythonCode(pythonCode: string): RunResult {
  const stdoutArr: string[] = [];

  const env: Record<string, any> = {
    print: (...args: any[]) => {
      const formatted = args
        .map((a) => {
          if (typeof a === 'object' && a !== null) {
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          }
          return String(a);
        })
        .join(' ');
      stdoutArr.push(formatted);
    },
    len: (obj: any) => {
      if (obj == null) return 0;
      if (typeof obj === 'string' || Array.isArray(obj)) return obj.length;
      if (typeof obj === 'object') return Object.keys(obj).length;
      return 0;
    },
    int: (val: any) => {
      const num = Number(val);
      return isNaN(num) ? 0 : Math.trunc(num);
    },
    float: (val: any) => {
      const num = Number(val);
      return isNaN(num) ? 0.0 : num;
    },
    str: (val: any) => String(val),
    round: (val: any, decimals = 0) => {
      const n = Number(val);
      if (isNaN(n)) return 0;
      const factor = Math.pow(10, decimals);
      return Math.round(n * factor) / factor;
    },
    range: (start: number, stop?: number, step = 1) => {
      if (stop === undefined) {
        stop = start;
        start = 0;
      }
      const arr: number[] = [];
      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        arr.push(i);
      }
      return arr;
    },
    max: (...args: any[]) => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.max(...list);
    },
    min: (...args: any[]) => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.min(...list);
    },
    sum: (arr: number[]) => {
      if (!Array.isArray(arr)) return 0;
      return arr.reduce((acc, curr) => acc + Number(curr), 0);
    },
  };

  try {
    const jsCode = transpilePythonToJS(pythonCode);

    // Extract defined function names
    const funcNames: string[] = [];
    const funcRegex = /def\s+([a-zA-Z0-9_]+)\s*\(/g;
    let match;
    while ((match = funcRegex.exec(pythonCode)) !== null) {
      funcNames.push(match[1]);
    }

    const wrappedCode = `
      var { print, len, int, float, str, round, range, max, min, sum } = env;
      ${jsCode}

      return {
        ${funcNames.map((fn) => `"${fn}": typeof ${fn} === "function" ? ${fn} : undefined`).join(',\n')}
      };
    `;

    const runner = new Function('env', wrappedCode);
    const scope = runner(env);

    return {
      success: true,
      stdout: stdoutArr.join('\n'),
      returnValue: scope,
      functionsDefined: funcNames,
    };
  } catch (err: any) {
    return {
      success: false,
      stdout: stdoutArr.join('\n'),
      error: err?.message || String(err),
      functionsDefined: [],
    };
  }
}

export function gradeStudentFunction(
  pythonCode: string,
  functionName: string,
  testCases: TestCase[]
): { passedAll: boolean; results: TestResult[] } {
  const hasDef = new RegExp(`def\\s+${functionName}\\s*\\(`).test(pythonCode);
  if (!hasDef) {
    return {
      passedAll: false,
      results: [
        {
          passed: false,
          description: `Definisi fungsi def ${functionName}(...)`,
          expectedText: `Fungsi bernama '${functionName}' terdefinisi`,
          actualText: `Fungsi '${functionName}' tidak ditemukan dalam kode`,
          error: `Pastikan nama fungsi ditulis persis: def ${functionName}(...)`,
        },
      ],
    };
  }

  const hasReturn = /\breturn\b/.test(pythonCode);
  if (!hasReturn && !functionName.startsWith('cetak_')) {
    return {
      passedAll: false,
      results: [
        {
          passed: false,
          description: 'Penggunaan nilai balik (return value)',
          expectedText: 'Fungsi harus mengembalikan nilai menggunakan kata kunci "return"',
          actualText: 'Kata kunci "return" tidak terdeteksi dalam fungsi',
          error: 'Gunakan "return", bukan hanya "print()", agar hasil fungsi dapat dimanfaatkan oleh modul lain.',
        },
      ],
    };
  }

  const runResult = executePythonCode(pythonCode);
  if (!runResult.success) {
    return {
      passedAll: false,
      results: [
        {
          passed: false,
          description: 'Kompilasi & Eksekusi Sintaks Python',
          expectedText: 'Kode berhasil dijalankan tanpa error sintaks',
          actualText: `Error: ${runResult.error}`,
          error: runResult.error,
        },
      ],
    };
  }

  const scope = runResult.returnValue;
  const targetFunc = scope?.[functionName];

  if (typeof targetFunc !== 'function') {
    return {
      passedAll: false,
      results: [
        {
          passed: false,
          description: `Pemanggilan fungsi ${functionName}`,
          expectedText: `Objek fungsi ${functionName} dapat dipanggil`,
          actualText: `Ditemukan tipe: ${typeof targetFunc}`,
          error: `Fungsi ${functionName} gagal diinisialisasi dengan benar.`,
        },
      ],
    };
  }

  const results: TestResult[] = [];
  let allPass = true;

  for (const tc of testCases) {
    try {
      const actual = targetFunc(...tc.inputArgs);

      let passed = false;
      const actualText = formatValue(actual);
      const expectedText = tc.expectedText ?? formatValue(tc.expectedReturn);

      if (tc.customValidator) {
        passed = tc.customValidator(actual, runResult.stdout);
      } else if (Array.isArray(tc.expectedReturn) && Array.isArray(actual)) {
        passed = JSON.stringify(actual) === JSON.stringify(tc.expectedReturn);
      } else if (typeof tc.expectedReturn === 'number') {
        passed = Math.abs(Number(actual) - tc.expectedReturn) < 0.001;
      } else if (tc.expectedReturn !== undefined) {
        passed = actual === tc.expectedReturn;
      } else {
        passed = true;
      }

      if (!passed) allPass = false;

      results.push({
        passed,
        description: tc.description,
        expectedText,
        actualText,
      });
    } catch (err: any) {
      allPass = false;
      results.push({
        passed: false,
        description: tc.description,
        expectedText: tc.expectedText ?? formatValue(tc.expectedReturn),
        actualText: `Error runtime: ${err?.message || String(err)}`,
        error: err?.message || String(err),
      });
    }
  }

  return { passedAll: allPass, results };
}

function formatValue(val: any): string {
  if (val === undefined) return 'None';
  if (val === null) return 'None';
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) {
    return `(${val.map(formatValue).join(', ')})`;
  }
  return String(val);
}

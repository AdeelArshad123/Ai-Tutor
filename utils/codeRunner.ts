import { Exercise, TestCase } from '../types';

interface TestResult {
    passed: boolean;
    input: string;
    output: string;
    expected: string;
}

// WARNING: This is a SIMULATED code runner. It does NOT execute arbitrary code.
// In a real-world application, you would need a secure sandbox environment on a server
// or use something like WebAssembly to run user code safely on the client.
// For this educational project, we will use a simplified approach.

const runJs = (userCode: string, testCase: TestCase): { output: string, passed: boolean } => {
    try {
        // A very basic and unsafe way to evaluate code. **DO NOT USE IN PRODUCTION**.
        // We are creating a function from the user's code and then calling it.
        // This is slightly safer than direct eval, but still highly insecure.
        // We isolate the scope by wrapping it.
        const F = new Function(`
            let module = { exports: {} };
            ${userCode};
            return module.exports.${testCase.input};
        `);
        
        const result = F();
        const output = JSON.stringify(result);
        const expected = JSON.stringify(testCase.expectedOutput);

        return { output: String(result), passed: output === expected };

    } catch (error: any) {
        return { output: error.message, passed: false };
    }
}

const runHtml = (userCode: string, testCase: TestCase): { output: string, passed: boolean } => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(userCode, 'text/html');
        
        // This is a simplified way to "evaluate" the DOM state.
        const result = new Function('document', `return ${testCase.input}`)(doc);
        const output = String(result).trim();
        const expected = testCase.expectedOutput.trim();
        
        return { output, passed: output === expected };

    } catch (error: any) {
        return { output: error.message, passed: false };
    }
}

export const runCode = (userCode: string, exercise: Exercise, language: string): TestResult[] => {
    return exercise.testCases.map(testCase => {
        let result: { output: string, passed: boolean };

        switch(language) {
            case 'javascript':
            case 'typescript': // Simplified: handle TS as JS
            case 'nodejs':
                result = runJs(userCode, testCase);
                break;
            case 'html':
                result = runHtml(userCode, testCase);
                break;
            default:
                // For other languages, we'll just do a simple string comparison against the solution
                // This is a placeholder for a real execution environment
                const simplifiedUserCode = userCode.replace(/\s+/g, ' ').trim();
                const simplifiedSolution = exercise.solution.replace(/\s+/g, ' ').trim();
                const passed = simplifiedUserCode === simplifiedSolution;
                result = { output: passed ? 'Correct' : 'Incorrect', passed };
        }

        return {
            passed: result.passed,
            input: testCase.input,
            output: result.output,

            expected: testCase.expectedOutput,
        };
    });
};
import fs, { ReadStream } from 'fs';
import readline from 'readline';

interface MachineFile {
    lengthA: number;
    lengthS: number;
    s0: number;
    lengthF: number;
    finalStates: number[];
    rules: Array<Rules>;
}

async function getParamsFromFile(): Promise<MachineFile> {
    const readStream: ReadStream = fs.createReadStream('stateMachine.txt');

    const r1 = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
    });

    const lines: string[] = [];
    for await (const line of r1) {
        lines.push(line);
    }

    return {
        lengthA: parseInt(lines[0]),
        lengthS: parseInt(lines[1]),
        s0: parseInt(lines[2]),
        lengthF: parseInt(lines[3]),
        finalStates: lines[3]
            .split(' ')
            .map(el => +el)
            .splice(1),
        rules: ((): Array<Rules> => {
            const answer: Array<Rules> = [];
            for (let i = 4; i < lines.length; i++) {
                const lineArray: Array<string> = lines[i].split(' ');
                answer.push({
                    sFrom: parseInt(lineArray[0]),
                    through: lineArray[1],
                    sTo: parseInt(lineArray[2]),
                });
            }
            return answer;
        })(),
    };
}

interface Rules {
    sFrom: number;
    through: string;
    sTo: number;
}

interface Dictionary<T> {
    [key: string]: T;
}

interface FiniteStateAutomationInterface {
    stateTable: Array<Dictionary<number>>;
    finalStates: Array<number>;
    s0: number;
}

class FiniteStateAutomation implements FiniteStateAutomationInterface {
    stateTable: Array<Dictionary<number>>;
    finalStates: Array<number> = [];
    s0: number;
    constructor(
        lengthA: number,
        lengthS: number,
        s0: number,
        lengthF: number,
        finalStates: number[],
        rules: Array<Rules>,
    ) {
        this.finalStates = finalStates;
        this.s0 = s0;
        const stateTable: Array<Dictionary<number>> = new Array(lengthA).fill({});
        for (const rule of rules) {
            stateTable[rule.sFrom][rule.through] = rule.sTo;
        }
        this.stateTable = stateTable;
    }
}

class Main {
    static async main(args?: any): Promise<void> {
        const machineFile = await getParamsFromFile();
        const stateMachine = new FiniteStateAutomation(
            machineFile.lengthA,
            machineFile.lengthS,
            machineFile.s0,
            machineFile.lengthF,
            machineFile.finalStates,
            machineFile.rules,
        );
        console.log(JSON.stringify(stateMachine));
    }
}

Main.main();

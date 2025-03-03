import { createWriteStream } from "node:fs";
import { inspect } from "node:util";

let isComplete = false;

let loggingStream;
const logDestination = process.argv.find(x => x.startsWith("--log="))?.substring(6);
const [ logImpl, logErrorImpl ] = logDestination ? fileLoggers() : consoleLoggers();

function consoleLoggers() {

    return  [ console.log.bind(console), console.error.bind(console) ];

}


function fileLoggers() {

    loggingStream = createWriteStream(logDestination);
    function log(...args) {

        const info = args.map(a => typeof a === "string" ? a : inspect(a)).join(" ");
        loggingStream.write(info);
        loggingStream.write("\n");

    }
    return [
        log,
        (...args) => log("ERROR: ", ...args)
    ];
}

 export function loggingComplete() {

    isComplete = true;

}

export function log(...args) {

    stack.push([logImpl, new Date(), args]);

}

export function logError(...args) {

    stack.push([logErrorImpl, new Date(), args]);

}

const stack = [];
function processStack() {

    while(stack.length){

        const [method, when, args] = stack.shift();
        const timestamp = `[ ${when.toISOString().split("T")[1].substring(0,12)} ]`;
        method(timestamp, ...args);

    }
    if(isComplete) {

        cleanUp();

    } else {

        setTimeout(processStack, 10);

    }

}

processStack();

function cleanUp() {
    if (loggingStream) {

        loggingStream.end();
        loggingStream = null;

    }
}

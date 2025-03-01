import { QUESTION_ANSWERED, QUESTION_RAISED, STATEMENT } from "./messages.js";
import defaultReadlineSync from "readline-sync";

export function UserConsole(readlineSync = defaultReadlineSync, consoleImpl = console) {

    return async function UserConsoleHandler(messageType, message) {

        switch(messageType) {

            case QUESTION_RAISED:
                const text = readlineSync.question(`${message.text} `);
                return [ QUESTION_ANSWERED, { text } ];

            case STATEMENT:
                consoleImpl.log(...message.args);
                return;

        }

    };

}
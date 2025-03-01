import { resolveScenarios } from "../lib/resolve-scenarios.js";
import { POST, POST_OUTCOME, QUESTION_ANSWERED, QUESTION_RAISED, STATEMENT } from "./messages.js";
import { UserConsole } from "./user-console.js";

export function UserConsoleTest() {

    return async function UserConsoleTestHandler(messageType) {

        if (messageType !== POST) return;


        // A
        const logQuestions = [];
        const fakeReadlineSync = {

            question(...args) {

                logQuestions.push(args);
                return "It's blue, of course.";

            }

        };
        const logConsoleLog = [];
        const fakeConsole = {

            log(...args) {

                logConsoleLog.push(args);

            }

        }
        const sut = UserConsole(fakeReadlineSync, fakeConsole);

        // Act (1)
        const response = await sut(QUESTION_RAISED, { text: "What is your favourite colour?" });

        // Act (2)
        await sut(STATEMENT, { args: [ "Welcome to the circus" ] });

        // Act (3)
        const response3 = await sut(QUESTION_RAISED, { function: "some_call" });

        // A
        return [
             POST_OUTCOME,
            {
                class: UserConsole,
                ...resolveScenarios({
                    "On statement: logs to console": [
                        logConsoleLog.shift(),
                        ["Welcome to the circus"]
                    ],
                    "On question raised: asks the question": [
                        logQuestions[0],
                        ["What is your favourite colour? "]
                    ],
                    "returns a question answered": [
                        response?.[0],
                        QUESTION_ANSWERED
                    ],
                    "returns the user's answer": [
                        response?.[1]?.text,
                        "It's blue, of course."
                    ],
                    "but, given no text, does nothing": [
                        [logConsoleLog.length, response3],
                        [0, undefined]
                    ],
                })
            }
        ];

    }

}

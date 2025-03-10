import { resolveScenarios } from "../lib/resolve-scenarios.js";
import { POST, POST_OUTCOME } from "./messages.js"
import { POSTReporter } from "./post-reporter.js";

export function POSTReporterTest() {

    return async function POSTReporterTestHandler(messageType) {

        if (messageType !== POST) return;

        // Arrange
        const logged = []
        const fake = (...args) => logged.push(args);
        const sut = POSTReporter(fake);

        // Act (1)
        await sut(POST_OUTCOME, {
            class: { name: "Some class" },
            pass: true,
            scenarios: [{ name: "S1" }, { name: "S2" }]
        })

        // Act (2)
        let negativeTestException;
        try {

            await sut(POST_OUTCOME, {
                class: { name: "Some class" },
                pass: false,
                scenarios: [
                    { name: "S1", expected: 1, actual: 1, pass: true },
                    { name: "S2", expected: 1, actual: 2, pass: false }
                ]
            });

        } catch(err) {

            negativeTestException = err;

        }

        // Act (3)
        let symbolTestException;
        try {

            await sut(POST_OUTCOME, {
                class: { name: "Some class 2" },
                pass: false,
                scenarios: [
                    { name: "S1", expected: Symbol("a"), actual: Symbol("b"), pass: false },
                ]
            });

        } catch(err) {

            symbolTestException = err;

        }

        // Assert
        return [
            POST_OUTCOME,
            {
                class: POSTReporter,
                ...resolveScenarios({
                    "On pass it is logging a short message": [
                        logged[0],
                        ["✅ Some class POST - S1, S2"]
                    ],
                    "On fail: it is throwing an error with details": [
                        negativeTestException.message,
                        "Some class POST failure\n - ✅ 1. S1\n - ❌ 2. S2\n      Expected: 1\n      Actual: 2"
                    ],
                    "documents symbols in actual and expected": [
                        symbolTestException.message,
                        "Some class 2 POST failure\n - ❌ 1. S1\n      Expected: Symbol(a)\n      Actual: Symbol(b)"
                    ]
                })
            }
        ];
    }
}
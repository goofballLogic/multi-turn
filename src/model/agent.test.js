import { LLM_RESPONDED, POST, POST_OUTCOME, USER_RESPONDED } from "./messages.js";
import { Agent } from "./agent.js";
import { resolveScenarios } from "../lib/resolve-scenarios.js";
import { FakeAI } from "../fixtures/FakeAI.js";

export function AgentTest() {

    return async function AgentTestHandler(messageType) {

        if(messageType !== POST) return;

        // Arrange
        const fakeAI = new FakeAI(input => [
            { message: { role: "assistant", content: `Hello user ${JSON.stringify(input)}` } }
        ]);
        const sut = Agent(fakeAI);

        // Act
        const response = await sut(USER_RESPONDED, { text: "Hello world" });

        // Assert
        return [
            POST_OUTCOME,
            {
                class: Agent,
                ...resolveScenarios({
                    "Responding with LLM_RESPONDED": [
                        response[0],
                        LLM_RESPONDED
                    ],
                    "Message includes the text from the AI": [
                        response[1]?.text,
                        `Hello user {"messages":[{"role":"user","content":"Hello world"}]}`
                    ]
                })
            }
        ];

    };

}
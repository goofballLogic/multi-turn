import { LLM_RESPONDED, POST, POST_OUTCOME, USER_RESPONDED } from "./messages.js";
import { Agent } from "./agent.js";

export function AgentTest() {

    return async function AgentTestHandler(messageType, message) {

        if(messageType === POST) {

            const mockAI = {
                chat: {
                    completions: {
                        async create(payload) {

                            return {
                                choices: [
                                    {
                                        message: {
                                            role: "assistant",
                                            content: `Hello user ${JSON.stringify(payload)}`
                                        }
                                    }
                                ]
                            };

                        }
                    }
                }
            };
            const sut = Agent(mockAI);
            const actual = await sut(USER_RESPONDED, { text: "Hello world" });
            const actualText = actual[1]?.text;
            const expectedText = `Hello user {"messages":[{"role":"user","content":"Hello world"}]}`;
            return [
                POST_OUTCOME, 
                { 
                    class: Agent, 
                    pass: actualText == expectedText,
                    scenarios: [ 
                        { actual: actualText, expected: expectedText } 
                    ] 
                }
            ];
            
        }

    };

}

async function handleUserResponse(message) {

    console.log("Handle message", message);

}
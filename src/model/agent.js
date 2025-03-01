import { LLM_RESPONDED, USER_RESPONDED } from "./messages.js";
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) throw new Error("Missing configuration: OPENAI_API_KEY");
const openai = new OpenAI(); // looks for process.env.OPENAI_API_KEY
if (!(openai?.chat?.completions?.create)) throw new Error("Unexpected library API: openai.chat.completions.create");

export function Agent(ai = openai) {

    return async function AgentHandler(messageType, message) {

        if(messageType === USER_RESPONDED)
            return await handleUserResponse(ai, message);

    };

}

async function handleUserResponse(ai, message) {

    const response = await ai.chat.completions.create({
        messages: [
            { role: "user", content: message.text }
        ]
    });
    return [
        LLM_RESPONDED,
        {
            text: response?.choices?.[0]?.message?.content
        }
    ];

}
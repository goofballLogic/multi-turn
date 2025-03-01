import { Hub } from "./lib/hub.js";
import { Agent } from "./model/agent.js";
import { AgentTest } from "./model/agent.test.js";
import { POST, POST_OUTCOME, USER_RESPONDED } from "./model/messages.js";
import { inspect } from "node:util";

var main = Hub("main",
    AgentTest(),
    Agent(),
    handlePostOutcomes
);

function handlePostOutcomes(messageType, message) {
    
    if(messageType !== POST_OUTCOME) return;
    if(message.pass) {

        console.log(`✅ ${message.class.name} - ${message.scenarios.map(s => s.name).join(", ")}`);

    } else {

        throw new Error(`${message.class.name}\n${message.scenarios.map(scenario).join("\n")}`);

    }

    function scenario({ number, name, pass, actual, expected }) {

        if(pass) {
            
            return ` - ✅ ${number + 1}. ${name}`

        } else {

            return ` - ❌ ${number + 1}. ${name}\n      Expected: ${JSON.stringify(expected)}\n      Actual: ${JSON.stringify(actual)}`;

        }
    }

}

main(POST, {});

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { question } from "readline-sync";

// if (!process.env.GOOGLE_API_KEY) throw new Error("Missing configuration: GOOGLE_API_KEY");
// const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

// const functionDeclarations = [
//   {
//     name: "ask_clarification",
//     description: "Ask the user a question if you need more information.",
//     parameters: {
//       type: "object",
//       properties: {
//         question: {
//           type: "string",
//           description: "A question that clarifies what is needed from the user."
//         }
//       },
//       required: ["question"]
//     }
//   },
//   {
//     name: "provide_answer",
//     description: "Provide the final answer when no further clarifications are needed.",
//     parameters: {
//       type: "object",
//       properties: {
//         answer: {
//           type: "string",
//           description: "A complete answer to the user's query."
//         }
//       },
//       required: ["answer"]
//     }
//   }
// ];

// // Start with an empty conversation history.
// const conversationHistory = [];

// async function chatWithAI(userInput) {
//   // If conversationHistory is empty, push the initial instructions.
//   if (conversationHistory.length === 0) {
//     const instruction = `
// You are an assistant that must *only* respond by calling one of these two functions:
// 1) ask_clarification(question) if you need more info.
// 2) provide_answer(answer) if you have enough info but don't assume anything - keep clarifying until you have a precise answer.

// Never respond in plain text, always return a function call.
//     `;
//     conversationHistory.push({
//       role: "user",
//       parts: [{ text: instruction }]
//     });
//   }

//   // Append the user input using the correct structure.
//   conversationHistory.push({
//     role: "user",
//     parts: [{ text: userInput }]
//   });

//   let retries = 0;
//   const maxRetries = 3;

//   while (retries < maxRetries) {
//     // Send the conversation history along with function declarations.
//     const result = await model.generateContent({
//       contents: conversationHistory,
//       tools: [{ functionDeclarations }]
//     });

//     const response = result.response;
//     const candidates = response.candidates || [];
//     if (candidates.length === 0) {
//       return { type: "error", content: "No response from Gemini." };
//     }

//     // Use the first candidate's first part.
//     const parts = candidates[0].content.parts || [];
//     if (parts.length === 0) {
//       return { type: "error", content: "No message parts returned." };
//     }

//     const message = parts[0];
//     if (message.functionCall) {
//       const fc = message.functionCall;
//       if (fc.name === "ask_clarification") {
//         return { type: "clarification", question: fc.args.question };
//       } else if (fc.name === "provide_answer") {
//         return { type: "answer", answer: fc.args.answer };
//       } else {
//         return { type: "error", content: `Unknown function: ${fc.name}` };
//       }
//     } else {
//         console.warn("VIOLATION: ", JSON.stringify(message));
//       // Violation: model did not use a function call.
//       console.log("⚠️ The model violated instructions. Retrying...");
//       conversationHistory.push({
//         role: "user",
//         parts: [{ text: "Reminder: You must only respond with function calls. Please comply." }]
//       });
//       retries++;
//     }
//   }

//   return { type: "error", content: "Max retries exceeded due to violation." };
// }

// (async function main() {
//   console.log("🔮 Gemini Clarification Chat. Type 'exit' to quit.");

//   while (true) {
//     const userInput = question("You: ");
//     if (userInput.toLowerCase() === "exit") {
//       console.log("Goodbye!");
//       break;
//     }

//     const aiResponse = await chatWithAI(userInput);

//     if (aiResponse.type === "clarification") {
//       console.log("AI Clarification Question:", aiResponse.question);
//       conversationHistory.push({
//         role: "assistant",
//         parts: [{ text: `Clarification needed: ${aiResponse.question}` }]
//       });
//     } else if (aiResponse.type === "answer") {
//       console.log("AI Final Answer:", aiResponse.answer);
//       conversationHistory.push({
//         role: "assistant",
//         parts: [{ text: `Final Answer: ${aiResponse.answer}` }]
//       });
//       // Optionally, you can choose to reset the conversation history after a final answer.
//     } else if (aiResponse.type === "error") {
//       console.log("Error:", aiResponse.content);
//     }
//   }
// })();
import { log } from "../lib/log.js";
import { POST_OUTCOME } from "./messages.js";

export function POSTReporter() {

    return function handlePostOutcomes(messageType, message) {
            
        if(messageType !== POST_OUTCOME) return;
        if(message.pass) {
    
            log(`✅ ${message.class.name} POST - ${message.scenarios.map(s => s.name).join(", ")}`);
    
        } else {
    
            throw new Error(`POST ${message.class.name}\n${message.scenarios.map(scenario).join("\n")}`);
    
        }
    
        function scenario({ number, name, pass, actual, expected }) {
    
            if(pass) {
                
                return ` - ✅ ${number + 1}. ${name}`
    
            } else {
    
                return ` - ❌ ${number + 1}. ${name}\n      Expected: ${JSON.stringify(expected)}\n      Actual: ${JSON.stringify(actual)}`;
    
            }
        }
    
    };

}
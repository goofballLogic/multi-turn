import { log as default_log } from "../lib/log.js";
import { POST_OUTCOME } from "./messages.js";

export function POSTReporter(log = default_log) {

    return function handlePostOutcomes(messageType, message) {

        if(messageType !== POST_OUTCOME) return;
        if(message.pass) {

            log(`✅ ${message.class.name} POST - ${message.scenarios.map(s => s.name).join(", ")}`);

        } else {

            throw new Error(`${message.class.name} POST failure\n${message.scenarios.map(scenario).join("\n")}`);

        }

        function scenario({ name, pass, actual, expected }, number) {

            if(pass) {

                return ` - ✅ ${number + 1}. ${name}`

            } else {

                return ` - ❌ ${number + 1}. ${name}\n      Expected: ${JSON.stringify(expected)}\n      Actual: ${JSON.stringify(actual)}`;

            }
        }

    };

}
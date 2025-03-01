import { FakeCompletions } from "./FakeCompletions.js";

export class FakeAI {

    constructor(choicesStrategy) {

        this.chat = { completions: new FakeCompletions(choicesStrategy) };

    }
}

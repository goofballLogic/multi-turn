export class FakeCompletions {

    #choicesStrategy;

    constructor(choicesStrategy) {

        this.#choicesStrategy = choicesStrategy;

    }

    async create(input) {

        var choices = this.#choicesStrategy(input);
        return Promise.resolve({ choices });

    }
}

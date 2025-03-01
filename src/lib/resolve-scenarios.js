export function resolveScenarios(scenarioDefinitions) {

    function resolveScenario([name, [actual, expected]], i) {

        return {
            number: i,
            name,
            actual,
            expected,
            pass: actual === expected
        };

    }

    const scenarios = Object.entries(scenarioDefinitions).map(resolveScenario);
    return {
        pass: scenarios.every(x => x.pass),
        scenarios
    };

}

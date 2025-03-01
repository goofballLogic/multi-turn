export function resolveScenarios(scenarioDefinitions) {

    function resolveScenario([name, [actual, expected]], i) {

        return {
            number: i,
            name,
            actual,
            expected,
            pass: equality(actual, expected)
        };

    }

    const scenarios = Object.entries(scenarioDefinitions).map(resolveScenario);
    return {
        pass: scenarios.every(x => x.pass),
        scenarios
    };

}
function equality(actual, expected) {

    switch (typeof actual) {
        case "symbol":
            return actual === expected;
        case "object":
            return JSON.stringify(actual) === JSON.stringify(expected);
        default:
            return actual === expected;
    }

}


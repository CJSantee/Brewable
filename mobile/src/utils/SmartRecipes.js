function toTwoDigits(num) {
    return Math.round(num * 10) / 10;
}

function limitOut(num) {
    if (num < 50) return 50;
    if (num > 100) return 100;
    return num;
}

function limitTemp(temp, temp_unit) {
    if (temp_unit === "f") return temp > 212 ? 212 : temp;
    if (temp_unit === "c") return temp > 100 ? 100 : temp;
}

const issues = [
    {
        uid: "tooWeak",
        title: "Too Weak",
        subtitle: "(Thin/Watery)",
        fix: (brew) => {
            return {
                ...brew,
                coffee: toTwoDigits(brew.coffee * 1.025),
                body: limitOut(brew.body + 15),
                flavor: limitOut(brew.flavor + 15),
                notes: "Suggestion: Tighten the grind.",
            };
        },
    },
    {
        uid: "tooStrong",
        title: "Too Strong",
        subtitle: "(Thick/Heavy)",
        fix: (brew) => {
            return {
                ...brew,
                coffee: toTwoDigits(brew.coffee * 0.975),
                body: limitOut(brew.body + 15),
                flavor: limitOut(brew.flavor + 15),
                notes: "",
            };
        },
    },
    {
        uid: "tooAcidic",
        title: "Too Acidic",
        subtitle: "(Sour)",
        fix: (brew) => {
            return {
                ...brew,
                grind_setting: toTwoDigits(
                    parseFloat(brew.grind_setting) * 0.975
                ),
                temperature: limitTemp(brew.temperature + 2, brew.temp_unit),
                acidity: limitOut(brew.acidity + 15),
                notes: "",
            };
        },
    },
    {
        uid: "tooBitter",
        title: "Too Bitter",
        subtitle: "",
        fix: (brew) => {
            return {
                ...brew,
                coffee: toTwoDigits(brew.coffee * 1.025),
                flavor: limitOut(brew.flavor + 15),
                acidity: limitOut(brew.acidity + 5),
                notes: "",
            };
        },
    },
    {
        uid: "mutedFlavors",
        title: "Muted Flavors",
        subtitle: "",
        fix: (brew) => {
            return {
                ...brew,
                coffee: toTwoDigits(brew.coffee * 0.975),
                body: limitOut(brew.body + 15),
                notes: "Beans could be old and stale.",
            };
        },
    },
    {
        uid: "drawdownTooSlow",
        title: "Drawdown Too Slow",
        subtitle: "",
        fix: (brew) => {
            return { ...brew, notes: "Suggestion: Loosen the grind." };
        },
    },
    {
        uid: "drawdownTooFast",
        title: "Drawdown Too Fast",
        subtitle: "",
        fix: (brew) => {
            return { ...brew, notes: "Suggestion: Tighten the grind." };
        },
    },
];

function getIssue(_uid) {
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].uid === _uid) {
            return issues[i];
        }
    }
    return {
        uid: "error",
        title: "ERROR",
        subtitle: "Error",
    };
}

export function suggestIssues(brew) {
    // Initialize Suggestions with Header
    let suggestions = [
        {
            uid: "header-1",
            title: "Suggestions",
            subtitle: "header",
        },
    ];

    // Create remaining array with all the original issues
    let remaining = [];
    for (var i = 0; i < issues.length; i++) {
        remaining.push(issues[i]);
    }

    // Add issues associated with flavor
    if (brew.flavor < 50) {
        suggestions.push(getIssue("tooWeak"));
        suggestions.push(getIssue("tooStrong"));
    }
    // Add issues associated with acidity
    if (brew.acidity < 50) {
        suggestions.push(getIssue("tooAcidic"));
    }
    // Add issues associated with aroma
    if (brew.aroma < 50) {
        suggestions.push(getIssue("mutedFlavors"));
    }
    // Add issues associated with body
    if (brew.body < 50) {
    }
    // Add issues associated with sweetness
    if (brew.sweetness < 50) {
    }
    // Add issues associated with aftertaste
    if (brew.aftertaste < 50) {
        suggestions.push(getIssue("tooBitter"));
    }

    // Remove the objects in suggetions from the remaining array
    for (var i = 0; i < suggestions.length; i++) {
        for (var j = 0; j < remaining.length; j++) {
            if (remaining[j] === suggestions[i]) {
                remaining.splice(j, 1);
                j--;
            }
        }
    }

    // Add the second header for Other Issues
    suggestions.push({
        uid: "header-2",
        title: "Other",
        subtitle: "header",
    });

    // Return the suggestions and remaing arrays combined
    return suggestions.concat(remaining);
}

export function suggestRecipe(issueUid, brew) {
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].uid === issueUid) {
            return issues[i].fix(brew);
        }
    }
}

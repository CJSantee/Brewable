const issues = [
    {
        uid: "tooWeak",
        title: "Too Weak",
        subtitle: "(Thin/Watery)",
        fix: (brew) => {
            return {...brew, coffee: brew.coffee+1};
        }
    }, 
    {
        uid: "tooStrong",
        title: "Too Strong",
        subtitle: "(Thick/Heavy)",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "tooAcidic",
        title: "Too Acidic",
        subtitle: "(Sour)",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "tooBitter",
        title: "Too Bitter",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "astringentQuality",
        title: "Astringent Quality",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "filmyQuality",
        title: "Filmy Quality",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "powderyQuality",
        title: "Powdery Quality",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "burntQuality",
        title: "Burnt Quality",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "mutedFlavors",
        title: "Muted Flavors",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "muddyCoffeeBed",
        title: "Muddy Coffee Bed",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "drawdownTooSlow",
        title: "Drawdown Too Slow",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    },
    {
        uid: "drawdownTooFast",
        title: "Drawdown Too Fast",
        subtitle: "",
        fix: (brew) => {
            return {...brew};
        }
    }
]

function getIssue(_uid) {
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].uid === _uid) {
            return issues[i];
        }
    }
    return {
        uid: "error",
        title: "ERROR",
        subtitle: "Error"
    };
}

export function suggestIssues(brew) {
    // Initialize Suggestions with Header
    let suggestions = [{
        uid: 'header-1',
        title: "Suggestions",
        subtitle: 'header'
    }];
    
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
        suggestions.push(getIssue("filmyQuality"));
        suggestions.push(getIssue("powderyQuality"));
        suggestions.push(getIssue("astringentQuality"));
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
        for(var j = 0; j < remaining.length; j++) {
            if (remaining[j] === suggestions[i]) {
                remaining.splice(j, 1);
                j--;
            }
        }
    }

    // Add the second header for Other Issues
    suggestions.push({
        uid: 'header-2',
        title: "Other",
        subtitle: 'header'
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
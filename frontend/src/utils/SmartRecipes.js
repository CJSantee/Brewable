const issues = [
    {
        uid: "tooWeak",
        title: "Too Weak",
        subtitle: "(Thin/Watery)"
    }, 
    {
        uid: "tooStrong",
        title: "Too Strong",
        subtitle: "(Thick/Heavy)"
    },
    {
        uid: "tooAcidic",
        title: "Too Acidic",
        subtitle: "(Sour)"
    },
    {
        uid: "header1",
        title: "Suggestions",
        subtitle: "header"
    },
    {
        uid: "tooBitter",
        title: "Too Bitter",
        subtitle: ""
    },
    {
        uid: "astringentQuality",
        title: "Astringent Quality",
        subtitle: ""
    },
    {
        uid: "filmyQuality",
        title: "Filmy Quality",
        subtitle: ""
    },
    {
        uid: "powderyQuality",
        title: "Powdery Quality",
        subtitle: ""
    },
    {
        uid: "burntQuality",
        title: "Burnt Quality",
        subtitle: ""
    },
    {
        uid: "mutedFlavors",
        title: "Muted Flavors",
        subtitle: "" 
    },
    {
        uid: "muddyCoffeeBed",
        title: "Muddy Coffee Bed",
        subtitle: ""
    },
    {
        uid: "drawdownTooSlow",
        title: "Drawdown Too Slow",
        subtitle: ""
    },
    {
        uid: "drawdownTooFast",
        title: "Drawdown Too Fast",
        subtitle: ""
    }
]

function getIssue(uid) {
    issues.forEach(issue => {
        if (issue.uid === uid) {
            return issue;
        }
    });
    return {
        uid: "error",
        title: "ERROR",
        subtitle: "Error"
    };
}

export function suggestIssues(brew) {
    let suggestions = [{
        uid: 'header-1',
        title: "Suggestions",
        subtitle: 'header'
    }]
    return issues;
}
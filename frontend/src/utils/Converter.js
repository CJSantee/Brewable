export function toBeansString(beans) {
    return `${beans.roaster} ${beans.name} \nOrigin: ${beans.origin} \nRoasted: ${toDateString(beans.roast_date)} \nWeight: ${beans.weight}${beans.weight_unit}`;
}

export function toBrewString(brew) {
    return `${brew.roaster} ${brew.name} \nWater: ${brew.water}${brew.water_unit} \nCoffee: ${brew.coffee}${brew.coffee_unit} \nGrind: ${brew.grind_setting} \nTemperature: ${brew.temperature}${brew.temp_unit} \nTime: ${brew.time}`;
}

export function toDateString(_date) {
    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (_date === "") return "";
    let date = new Date(_date);
    return date.toLocaleDateString('en-US', options);
}

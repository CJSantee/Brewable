export function toBeansString(beans) {
    return `${beans.roaster} ${beans.region} \n${beans.origin} \nRoasted: ${toDateString(beans.roast_date)} \nWeight: ${beans.weight}${beans.weight_unit}`;
}

export function toBrewString(brew) {
    return `${brew.roaster} ${brew.region} \nCoffee: ${brew.coffee}${brew.coffee_unit} \nWater: ${brew.water}${brew.water_unit} \nTemperature: ${brew.temperature}${brew.temp_unit} \nTime: ${brew.time}`;
}

export function toDateString(_date) {
    const options = { weekdate: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (_date === "") return "";
    let date = new Date(_date);
    return date.toLocaleDateString('en-US', options);
}

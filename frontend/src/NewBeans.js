import React, { useState } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { SegmentedControl } from 'react-native-ios-kit';

import TableView from './components/TableView';
import TextFieldRow from './components/TextFieldRow';
import DatePickerRow from './components/DatePickerRow';

const NewBeans = () => {
    const [beans, setBeans] = useState({name: "", roaster: "", origin: "", roast_level: "", roast_date: new Date(), price: 0, weight: 0});

    return (
        <ScrollView>
            <TableView header="Roast">
                <TextFieldRow 
                    title="Name"
                    text={beans.name}
                    onChange={(value) => setBeans({...beans, name: value})}    
                />
                <TextFieldRow 
                    title="Roaster"
                    text={beans.roaster}
                    onChange={(value) => setBeans({...beans, roaster: value})}    
                />
                <TextFieldRow 
                    title="Origin"
                    text={beans.origin}
                    onChange={(value) => setBeans({...beans, origin: value})}    
                />
                <TextFieldRow 
                    title="Roast Level"
                    text={beans.roast_level}
                    onChange={(value) => setBeans({...beans, roast_level: value})}    
                />
            </TableView>
            <TableView header="Bag">
                <DatePickerRow title="Roast Date" value={beans.roast_date} onChange={(value) => setBeans({...beans, roast_date: value})}/>
                <TextFieldRow 
                    title="Price"
                    text={beans.price}
                    onChange={(value) => setBeans({...beans, price: value})}
                    keyboardType="decimal-pad"
                />
                <TextFieldRow 
                    title="Weight"
                    text={beans.weight}
                    onChange={(value) => setBeans({...beans, weight: value})}
                    keyboardType="decimal-pad"
                >
                    <SegmentedControl
                        values={['g', 'oz']}
                        selectedIndex={0}
                        onValueChange={() => setBeans({...beans})}
                        style={{width: 100}}
                    />
                </TextFieldRow>
            </TableView>
        </ScrollView>
    );
}

export default NewBeans;
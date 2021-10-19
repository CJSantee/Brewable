import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

// Component Imports
import Header from './components/Header';
import TableView from './components/TableView';
import RowItem from './components/RowItem';

const DebugPage = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    const _listDirectories = async () => {
        const data = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        console.debug(data);
    }
    const _getAlbums = async () => {
        const data = await MediaLibrary.getAlbumsAsync();
        data.forEach(album => {
            // console.log("id: " + album.id);
            console.log("title: " + album.title);
            console.log("assetCount: " + album.assetCount);
            // console.log("folderName: " + album.folderName);
            console.log("\n");
        });
    }
    const _deleteCoffeeLabAlbum = async () => {
        const album = await MediaLibrary.getAlbumAsync('Coffee Lab');
        let albums = [];
        albums.push(album);
        const data = await MediaLibrary.deleteAlbumsAsync(albums, true);
        console.log(data ? "Deleted Album" : "Could not delete album");
    }
    
    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Debug" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView style={styles.container}>
                <TableView header="Options">
                    <RowItem text="" title="List Directories" onPress={_listDirectories}/>
                    <RowItem text="" title="Get Albums" onPress={_getAlbums}/>
                    <RowItem text="" title="Delete Coffee Lab Album" onPress={_deleteCoffeeLabAlbum}/>
                </TableView>
            </ScrollView>
            {loading && <ActivityIndicator size="large" style={{bottom: 25}}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
})

export default DebugPage;
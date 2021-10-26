import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Modal,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const {width, height} = Dimensions.get('window');

// Component Imports
import Header from './components/Header';
import TableView from './components/TableView';
import RowItem from './components/RowItem';

const DebugPage = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [output, setOutput] = useState("");

    const log = (value) => {
        setOutput(output + value + "\n");
    }

    const _getAlbums = async () => {
        const data = await MediaLibrary.getAlbumsAsync();
        console.log(data.length)
        data.forEach(album => {
            // console.log("id: " + album.id);
            log("title: " + album.title);
            log("assetCount: " + album.assetCount);
            // console.log("folderName: " + album.folderName);
            log("\n");
        });
        setShowModal(true);
    }
    const _deleteCoffeeLabAlbum = async () => {
        setOutput("");
        const album = await MediaLibrary.getAlbumAsync('Coffee Lab');
        let albums = [];
        albums.push(album);
        const data = await MediaLibrary.deleteAlbumsAsync(albums, true);
        log(data ? "Deleted Album" : "Could not delete album");
        setShowModal(true);
    }
    
    return (
        <View style={{width: "100%", height: "100%"}}>
            <Header title="Debug" leftText="Back" leftChevron={true} leftOnPress={() => navigation.goBack()}/>
            <ScrollView style={styles.container}>
                <TableView header="Options">
                    <RowItem text="" title="List Directories" onPress={() => setShowModal(true)}/>
                    <RowItem text="" title="Get Albums" onPress={_getAlbums}/>
                    <RowItem text="" title="Delete Coffee Lab Album" onPress={_deleteCoffeeLabAlbum}/>
                </TableView>
            </ScrollView>
            {loading && <ActivityIndicator size="large" style={{bottom: 25}}/>}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
            >
                <TouchableOpacity style={styles.modalContainer} onPress={() => setShowModal(!showModal)}>
                        <View style={styles.modal}>
                            <Text style={{color: 'rgb(50,221,82)'}}>{output}</Text>
                        </View>
                </TouchableOpacity>
                
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        width: width-50,
        margin: 25,
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderColor: 'rgb(250,250,250)',
        borderWidth: 5,
        borderRadius: 5,
        padding: 10
    }
})

export default DebugPage;
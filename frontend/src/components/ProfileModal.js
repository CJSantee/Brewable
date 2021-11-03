import React from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const {width, height} = Dimensions.get('window');

function ProfileModal({showModal, setShowModal, title, text}) {
    const { colors } = useTheme(); // Color theme

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
        >
            <View style={styles.modalContainer}>
                <View style={{...styles.flavorModal, backgroundColor: colors.card, borderColor: colors.placeholder}}>
                    <View style={{...styles.modalHeader, borderColor: colors.border}}>
                        <Text style={{...styles.modalTitle, color: colors.text}}>{title}</Text>
                        <TouchableOpacity onPress={() => setShowModal(!showModal)} style={styles.closeModalIcon}>
                            <FontAwesome name="times-circle" size={20} color={colors.placeholder}/>
                        </TouchableOpacity>
                    </View> 
                    <Text style={{...styles.modalText, color: colors.text}}>{text}</Text>
                    <Text style={{...styles.modalText, fontStyle: 'italic', color: colors.text}}>SCAA Protocols | Cupping Specialty Coffee</Text>
                </View>
            </View>
        </Modal>
    );
}

export default ProfileModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor:'rgba(0,0,0,0.3)', 
        alignItems: 'center',
        justifyContent: 'center'
    },
    flavorModal: {
        width: width-30,
        margin: 15,
        borderWidth: 0.5,
        borderRadius: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginHorizontal: 15,
        borderBottomWidth: 1,
        paddingBottom: 5,
    }, 
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    closeModalIcon: {
        position: 'absolute',
        right: 0,
        top: 2,
    },
    modalText: {
        marginVertical: 10,
        marginHorizontal: 15,
        fontSize: 16
    }
});
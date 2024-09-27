import React from 'react';
import { Modal as ModalView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    closeBtnHidden?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    children: React.ReactNode;
    title?: string;
    titleStyle?: object;
    maskHidden?: boolean;
    statusBarTranslucent?: boolean
}

const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    closeBtnHidden = false,
    animationType = 'slide',
    transparent = true,
    children,
    title,
    titleStyle,
    maskHidden = false,
    statusBarTranslucent = false
}) => {
    return (
        <ModalView
            visible={visible}
            animationType={animationType}
            transparent={transparent}
            onRequestClose={onClose}
            statusBarTranslucent={statusBarTranslucent}
        >
            <View style={{
                ...styles.position,
                ...(maskHidden ? {} : styles.overlay)
            }}>
                <View style={styles.modalContainer}>
                    {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
                    {children}
                </View>
            </View>
        </ModalView>
    );
};

const styles = StyleSheet.create({
    position: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        position: 'relative', // Allow absolute positioning of the close button
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Modal;
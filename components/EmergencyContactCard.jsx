import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmergencyContactCard = ({ name, phone, children }) => {
    return (
        <View style={styles.card}>
            <View style={styles.contactInfo}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
            </View>
            <View style={styles.actionContainer}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#2E2E3A',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
        marginRight: 10,
    },
    name: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    phone: {
        color: '#CCC',
        fontSize: 16,
    },
    actionContainer: {
        flexDirection: 'row',
    },
});
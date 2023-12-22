import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

const CartScreen = () => {
    const cart = useSelector(state => state.cart.cart)
    console.log(cart);
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar />

            <Text style={{
                textAlign: 'center',
                fontSize: 24,
                marginVertical: 15
            }}>
                Your Shopping Cart
            </Text>

        </SafeAreaView>
    )
}

export default CartScreen;

const styles = StyleSheet.create({})
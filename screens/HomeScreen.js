import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import Navbar from '../components/Navbar';

const HomeScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <Navbar />

                {/* <Text>HomeScreen</Text> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
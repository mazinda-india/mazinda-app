import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Navbar from '../components/Navbar';
import Story from '../components/home/Story';
import Subcategories from '../components/home/Subcategories';
import Categories from '../components/home/Categories';

import { ScrollView } from 'react-native-virtualized-view'

const HomeScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <Navbar />

                <Story />

                <View style={{padding: 10}}>

                <Subcategories />
                </View>

                <View style={{padding: 10}}>

                <Categories />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
import { Modal, Pressable, StyleSheet, Text, TextInput, View, SafeAreaView, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';

const SearchModal = ({ existingSearchQuery, searchModalVisible, setSearchModalVisible }) => {
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState(existingSearchQuery ? existingSearchQuery : '');

    const handleSearch = async () => {
        navigation.navigate('Search', { searchQuery });
        setSearchModalVisible(false);
    }

    return (
        <Modal
            visible={searchModalVisible}
            onRequestClose={() => setSearchModalVisible(false)}
            animationType='slide'
        >
            <SafeAreaView
                style={{
                    flex: 1,
                }}>

                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    alignItems: 'center'
                }}>

                    <TouchableOpacity
                        onPress={() => setSearchModalVisible(false)}>
                        <Ionicons name="arrow-back" size={24} color="gray" />
                    </TouchableOpacity>

                    <TextInput
                        autoCorrect={false}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                        returnKeyType='search'
                        autoFocus={true}
                        style={{
                            borderColor: 'lightgray',
                            borderWidth: 1,
                            padding: 12,
                            marginHorizontal: 10,
                            borderRadius: 5,
                            width: '88%'
                        }}
                        onSubmitEditing={handleSearch}
                    />

                </View>

            </SafeAreaView>
        </Modal>
    )
}

export default SearchModal

const styles = StyleSheet.create({})
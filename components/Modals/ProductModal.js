import { StyleSheet, Text, View, Modal } from 'react-native'
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals'

const ProductModal = ({ productModalVisible, setProductModalVisible }) => {
    console.log(productModalVisible);
    return (
        <BottomModal
            onBackdropPress={() => setProductModalVisible(false)}
            visible={productModalVisible}
            swipeDirection={['up', 'down']}
            swipeThreshold={200}
            modalAnimation={new SlideAnimation({
                slideFrom: 'bottom',
            })}
            onHardwareBackPress={() => setProductModalVisible(false)}
        >
            <ModalContent style={{
                width: '100%',
                height: 400
            }}>
                <View>
                    <Text>Hello</Text>
                </View>
            </ModalContent>
        </BottomModal>
    )
}

export default ProductModal

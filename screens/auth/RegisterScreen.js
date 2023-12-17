import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Image,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Text,
    Platform
} from 'react-native';

import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons';
import MazindaLogo from '../../assets/logo/logo_mazinda_full.png';

const RegisterScreen = () => {
    const styles = {
        container: {
            flex: 1,
            backgroundColor: 'white',
            // fontFamily: 'Quicksand-Regular',
        },
        scrollView: {
            width: '100%',
        },
        logoContainer: {
            alignItems: 'center',
            marginTop: 30,
        },
        logo: {
            width: 200,
            height: undefined,
            aspectRatio: 3 / 1,
        },
        titleContainer: {
            alignItems: 'center',
            marginTop: 18,
        },
        title: {
            fontSize: 38,
            fontWeight: '500',
        },
        createAccountText: {
            fontSize: 20,
            color: '#4b5563',
        },
        inputContainer: {
            width: 300,
            marginTop: 10,
        },
        inputLabel: {
            fontSize: 18,
            fontWeight: '500',
            marginTop: 15,
            marginBottom: 5,
        },
        input: {
            borderColor: 'lightgray',
            borderWidth: 1,
            paddingVertical: 8,
            paddingHorizontal: 20,
            fontSize: 17,
            borderRadius: 100,
        },
        loginButton: {
            marginTop: 10,
            backgroundColor: 'black',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
        },
        loginButtonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
        },
        forgotPasswordText: {
            textDecorationLine: 'underline',
            textAlign: 'center',
            marginTop: 10,
            fontWeight: '500',
            fontSize: 15,
        },
        orText: {
            textAlign: 'center',
            marginTop: 15,
            fontWeight: '600',
            fontSize: 20,
            color: 'darkgray',
        },
        socialButton: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
            marginTop: 20,
            borderColor: 'lightgray',
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        socialButtonText: {
            fontSize: 18,
            textAlign: 'center',
        },
        googleIcon: {
            width: 20,
            height: 20,
            marginRight: 10,
        },
        guestButton: {
            backgroundColor: '#fe6321',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        guestButtonText: {
            fontSize: 18,
            textAlign: 'center',
            color: 'white',
            fontWeight: '600',
        },
        rightsText: {
            fontSize: 15,
            textAlign: 'center',
            marginVertical: 25,
            color: 'gray',
        },
    };

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.logoContainer}>
                    <Image source={MazindaLogo} style={styles.logo} resizeMode="contain" />
                </View>

                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Sign Up</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.createAccountText}>
                                or{' '}
                                <Text style={{ textDecorationLine: 'underline' }}>log into account</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 15 }}>


                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput style={styles.input} placeholder="Enter your name" />

                            <Text style={styles.inputLabel}>Phone</Text>
                            <TextInput style={styles.input} placeholder="Enter your phone number" />

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput style={styles.input} placeholder="Enter your email" />

                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput style={styles.input} secureTextEntry placeholder="Enter your password" />
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Log In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <Text style={styles.orText}>or</Text>

                            <TouchableOpacity style={styles.socialButton}>
                                <Image
                                    source={{
                                        uri:
                                            'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png',
                                    }}
                                    style={styles.googleIcon}
                                />
                                <Text style={styles.socialButtonText}>Continue With Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=> navigation.navigate("Main")} style={styles.guestButton}>
                                <FontAwesome5 name="users" size={20} color="white" style={{ marginRight: 10 }} />
                                <Text style={styles.guestButtonText}>Continue As Guest</Text>
                            </TouchableOpacity>

                            <Text style={styles.rightsText}>
                                @2023 All Rights Reserved{'\n'}Mazinda Commerce Private Limited{'\n'}
                                <Text style={{ color: 'black', fontWeight: '500', textDecorationLine: 'underline' }}>privacy</Text> and
                                <Text style={{ color: 'black', fontWeight: '500', textDecorationLine: 'underline' }}>terms</Text>
                            </Text>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterScreen;

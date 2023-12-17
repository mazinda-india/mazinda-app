import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  Linking,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesome5 } from '@expo/vector-icons';
import MazindaLogoFull from '../../assets/logo/logo_mazinda_full.png';

const LoginScreen = () => {
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
      marginTop: 50,
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
      marginTop: 18,
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
      backgroundColor: 'black',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 100,
      justifyContent: 'center'
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
      marginTop: 25,
      color: 'gray',
    },
  };

  const navigation = useNavigation();

  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    identifier: '', 
    password: '',
  })

  const handleLogin = async () => {
    setSubmitting(true);

    try {
      const { data } = await axios.post("https://mazinda.com/api/auth/login", {
        credentials,
      });
      console.log(data);

      if (data.success) {
        AsyncStorage.setItem("user_token", data.user_token);
        navigation.replace("Main");
      } else {
        console.log('Error has occurred');
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }

    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image source={MazindaLogoFull} style={styles.logo} resizeMode="contain" />
        </View>

        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Log In</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.createAccountText}>
                or{' '}
                <Text style={{ textDecorationLine: 'underline' }}>create account</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginTop: 15 }}>


            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone/Email</Text>
              <TextInput name="identifier" value={credentials.identifier} onChangeText={(text) => setCredentials({...credentials, identifier: text})} style={styles.input} placeholder="Enter your email or phone" />

              <Text style={styles.inputLabel}>Password</Text>
              <TextInput name="password" value={credentials.password} onChangeText={(text) => setCredentials({...credentials, password: text})} autoCapitalize='none' autoCorrect={false} style={styles.input} secureTextEntry placeholder="Enter your password" />
            </View>

            <View style={styles.inputContainer}>
              <Pressable style={styles.loginButton} onPress={handleLogin}>
                {!submitting ? <Text style={styles.loginButtonText}>Log In</Text> : <ActivityIndicator size='small' color='white' />}
              </Pressable>

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

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                <Text style={styles.rightsText}>
                  @2023 All Rights Reserved{'\n'}Mazinda Commerce Private Limited{'\n'}
                </Text>

                  <View style={{flexDirection: 'row', gap: 6}}>

                <Pressable
                  onPress={() => Linking.openURL('https://www.mazinda.com/privacy-policy')}>

                  <Text style={{ color: 'black', fontWeight: '500', textDecorationLine: 'underline' }}>privacy</Text>
                </Pressable>
                <Text style={{ color: 'gray' }}>and</Text>
                <Pressable onPress={() => Linking.openURL('https://www.mazinda.com/terms-and-conditions')}>

                  <Text style={{ color: 'black', fontWeight: '500', textDecorationLine: 'underline' }}>terms</Text>
                </Pressable>
                </View>

              </View>


            </View>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

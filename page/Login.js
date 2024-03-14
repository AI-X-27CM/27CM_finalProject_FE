import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { Input, Button as RNEButton } from 'react-native-elements';
import Header from './Header';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = JSON.parse(await AsyncStorage.getItem('@users'));
      return result;
    } catch (e) {
      console.log(e);
    }
  };
  const handleLogin = () => {
    if (!email || !password) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!validator.isEmail(email)) {
      alert('이메일 주소 형식이 올바르지 않습니다.');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.subContainer}>
        <Text style={styles.title}>로그인</Text>
        <TextInput
          placeholder="이메일 (e-mail)"
          onChangeText={setEmail}
          value={email}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="비밀번호 (pwd)"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          style={styles.inputContainer}
        />
        <RNEButton
          title="로그인"
          onPress={() => navigation.navigate('Main')}
          buttonStyle={styles.loginButton}
        />
        <RNEButton
          title="회원가입"
          onPress={() => navigation.navigate('SignUp')}
          buttonStyle={styles.signupButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  subContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderColor: '#333',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: 300,
    marginBottom: 10,
  },
  loginButton: {
    borderRadius: 10,
    backgroundColor: 'green',
    width: 300,
  },
  signupButton: {
    borderRadius: 10,
    backgroundColor: 'grey',
    width: 300,
    marginTop: 8,
  },
});

export default LoginPage;

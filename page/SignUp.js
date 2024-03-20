import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Input, Button as RNEButton } from 'react-native-elements';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validator from 'validator';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const SignUpPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const addUserUrl = 'http://192.168.0.165:8000/addUser'; // 서버 주소

  const handleSignUp = async () => {
    // 유효성 검사

    if (!email || !password || !passwordConfirm || !phoneNumber) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!validator.isEmail(email)) {
      alert('이메일 주소 형식이 올바르지 않습니다.');
      return;
    }

    if (password.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      setPassword('');
      setPasswordConfirm('');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호 확인이 일치하지 않습니다.');
      setPassword('');
      setPasswordConfirm('');
      return;
    }
    if (phoneNumber.length > 11) {
      alert('- 를 제외한 번호를 적어주세요');
      setPhoneNumber('');
      return;
    }

    // 비밀번호 hash화

    const hashedPassword = CryptoJS.SHA256(password).toString();

    const saveUser = async () => {
      try {
        const response = await axios.post(addUserUrl, newUser, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('File uploaded successfully', response.data);
        alert('회원가입이 완료되었습니다.');
      } catch (e) {
        error(e);
        console.log(e);
      }
    };

    let now = new Date();
    let kortime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const newUser = {
      id: email,
      pwd: hashedPassword,
      phone: phoneNumber,
      date: kortime,
    };

    await saveUser(newUser);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.subContainer}>
        <Text style={styles.title}>회원 가입</Text>
        <TextInput
          placeholder="이메일 주소"
          onChangeText={setEmail}
          value={email}
          style={styles.inputContainer}
          returnKeyType="done"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="비밀번호"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          style={styles.inputContainer}
          keyboardType="default"
        />
        <TextInput
          placeholder="비밀번호 확인"
          secureTextEntry
          onChangeText={setPasswordConfirm}
          value={passwordConfirm}
          style={styles.inputContainer}
          keyboardType="default"
        />
        <TextInput
          placeholder="전화번호"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          style={styles.inputContainer}
          keyboardType="number-pad"
        />
        <RNEButton
          title="회원 가입"
          onPress={handleSignUp}
          buttonStyle={styles.loginButton}
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
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    width: 300,
    marginBottom: 10,
  },
  loginButton: {
    borderRadius: 10,
    backgroundColor: '#f00',
    width: 300,
  },
});

export default SignUpPage;

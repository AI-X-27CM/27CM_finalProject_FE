import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import Header from './Header';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import axios from 'axios';

const Main = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [uri, setUri] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const url = 'http://192.168.0.194:8000/api';

  const Detecting = async () => {
    try {
      setIsRecording(true);
      // 권한 확인
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      // 권한 요청 및 오디오 모드 설정
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);

      if (recording) {
        const newIntervalId = setInterval(async () => {
          await sendRecording(recording); //stop
          clearInterval(newIntervalId);
          Detecting();
        }, 10000);
        setIntervalId(newIntervalId);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendRecording = async (recording) => {
    if (recording) {
      try {
        if (!recording._isDoneRecording) {
          await recording.stopAndUnloadAsync();
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const uri = await recording.getURI();

        console.log('Recording stopped and stored at', uri);

        const formData = new FormData();

        formData.append('file', {
          uri: uri,
          name: 'recording.m4a',
          type: 'audio/m4a',
        });

        try {
          const response = await axios({
            method: 'post',
            url: url, // 여기서 URL은 FastAPI 서버의 엔드포인트입니다.
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          console.log('File uploaded successfully', response.data);
        } catch (e) {
          console.log(e);
        }

        setRecording(undefined);
        console.log('Stopping recording..');
      } catch (e) {
        console.log(e);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false); // 녹음 중지
    if (intervalId) {
      clearInterval(intervalId); // 인터벌 멈춤
      setIntervalId(null);
      sendRecording(recording);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {isRecording ? (
        <>
          <View style={styles.title}>
            <Text style={styles.titleFont}>보이스피싱 탐지중</Text>
          </View>
          <View style={styles.middle}>
            <Text style={styles.percentage}>10%</Text>
            <Text style={styles.alert}>보이스 피싱일 확률이 적습니다.</Text>
          </View>
          <View style={styles.main}>
            <TouchableOpacity onPress={() => stopRecording()}>
              <Image
                source={require('../image/mainPage/Group 19.png')}
                style={styles.mainImage}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.title}>
            <Text style={styles.titleFont}>보이스피싱 App입니다.</Text>
          </View>
          <View style={styles.middle}>
            <Text style={styles.alert}>이미지를 Click 하세요</Text>
          </View>
          <View style={styles.main}>
            <TouchableOpacity onPress={() => Detecting()}>
              <Image
                source={require('../image/mainPage/Group 19.png')}
                style={styles.mainImage}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: 400,
    height: 400,
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  percentage: { color: 'white', fontSize: 48 },
  alert: { color: 'white', fontSize: 20 },
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  logo: {
    width: 98,
    height: 98,
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  titleFont: {
    color: 'white',
    backgroundColor: '#222222',
    fontSize: 48,
    fontWeight: 'bold',
  },
  title: {
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
});

export default Main;

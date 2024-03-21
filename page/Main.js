import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import Header from './Header';
import { useState } from 'react';
import { Audio } from 'expo-av';
import axios from 'axios';
import error from '../component/error';

const Main = ({ route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [intervalId, setIntervalId] = useState(null);
  const [label, setLabel] = useState('None');
  const [gpt, setGpt] = useState(0);

  const userNo = route.params.responseData;

  const url = 'http://192.168.0.165:8000/api';
  const gptUrl = 'http://192.168.0.165:8000/gpt';
  const startUrl = `http://192.168.0.165:8000/start/${userNo}`;
  const endUrl = `http://192.168.0.165:8000/end/${userNo}/${label}/${gpt}`;
  const Detecting = async () => {
    try {
      console.log('Detecting상훈');
      await axios.get(startUrl);

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
      error(e);
      console.log(e);
    }
  };

  const sendRecording = async (recording) => {
    if (recording) {
      try {
        console.log('sendRecording상훈');
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
        formData.append('userNo', userNo);

        await axios
          .post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(async (data) => {
            const text = data.data;
            const textData = {
              whisper: text,
            };
            const res = await axios.post(gptUrl, textData, {
              headers: { 'Content-Type': 'application/json' },
            });
            setLabel(res.data.label);
            setGpt(res.data.gpt_opinion);
          });

        setRecording(undefined);
        console.log('Stopping recording..');
      } catch (e) {
        error(e);
        console.log(e);
      }
    }
  };

  const stopRecording = async () => {
    console.log('녹음 중지 하자');
    setTimeout(async () => {
      try {
        await axios.get(endUrl).then(() => {
          setGpt(0);
          setLabel('None');
        });
        console.log('End URL request completed');
      } catch (e) {
        error(e);
        console.log(e);
      }
    }, 3000);
    setIsRecording(false); // 녹음 중지
    if (intervalId) {
      clearInterval(intervalId); // 인터벌 멈춤
      setIntervalId(null);
      sendRecording(recording);
    }
    setRecording('');
    return;
  };

  return (
    <View style={styles.container}>
      <Header />
      {isRecording ? (
        <>
          <View style={styles.title}>
            <Text style={styles.titleFont}>보이스피싱 탐지중</Text>
          </View>

          {gpt === 1 ? (
            <View style={styles.middle}>
              <Text style={styles.alert}>보이스 피싱이 의심됩니다.</Text>
            </View>
          ) : (
            <View style={styles.middle}>
              <Text style={styles.alert}>보이스 피싱일 확률이 적습니다.</Text>
            </View>
          )}

          <View style={styles.main}>
            <TouchableOpacity onPress={() => stopRecording()}>
              {gpt === 1 ? (
                <Image
                  source={require('../image/mainPage/Group 21.png')}
                  style={styles.mainImage}
                />
              ) : (
                <Image
                  source={require('../image/mainPage/Group 19.png')}
                  style={styles.mainImage}
                />
              )}
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

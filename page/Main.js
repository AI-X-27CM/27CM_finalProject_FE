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
import Main_FakeV from './Main_FakeV';
import API_ENDPOINTS from '../config/apiConfig';

const Main = ({ route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [intervalId, setIntervalId] = useState(null);
  const [label, setLabel] = useState('None');
  const [gpt, setGpt] = useState(0);
  const [fake, setFake] = useState(0);

  const userNo = route.params.responseData;

  const startUrl = `${API_ENDPOINTS.SRT_RECORD}/${userNo}`;
  const endUrl = `${API_ENDPOINTS.END_RECORD}/${userNo}/${label}/${gpt}`;
  const detecting = async () => {
    try {
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
          detecting();
        }, 10000);
        setIntervalId(newIntervalId);
      } else {
        clearInterval(intervalId);
        setIsRecording(false);
      }
    } catch (e) {
      error(e);
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

        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          name: 'recording.m4a',
          type: 'audio/m4a',
        });
        formData.append('userNo', userNo);

        await axios
          .post(API_ENDPOINTS.RECORD, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(async (data) => {
            setFake(data.data.synthesis);
            const text = data.data.combined_text;
            const textData = {
              whisper: text,
            };
            const res = await axios.post(API_ENDPOINTS.MODEL_GPT, textData, {
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
    setTimeout(async () => {
      try {
        await axios.get(endUrl).then(() => {
          setGpt(0);
          setLabel('None');
          setIsRecording(false); // 녹음 중지
        });
        console.log('End URL request completed');
      } catch (e) {
        error(e);
        console.log(e);
      }
    }, 5000);
    setIsRecording(false); // 녹음 중지
    if (intervalId) {
      clearInterval(intervalId); // 인터벌 멈춤
      setIntervalId(null);
      sendRecording(recording);
    }
    setRecording('');
    setFake(0);
  };

  return (
    <View style={styles.container}>
      <Header />
      {isRecording ? (
        <>
          <View style={styles.title}>
            <Text style={styles.titleFont}>보이스피싱 탐지중</Text>
          </View>

          {gpt === 2 ? (
            <View style={styles.middle}>
              <Text style={styles.alert}>보이스 피싱이 의심됩니다.</Text>
            </View>
          ) : gpt === 1 ? (
            <View style={styles.middle}>
              <Text style={styles.alert}>보이스 피싱일 확률이 적습니다.</Text>
            </View>
          ) : (
            <View style={styles.middle}>
              <Text style={styles.alert}>보이스 피싱일 확률이 적습니다.</Text>
            </View>
          )}
          <Main_FakeV data={fake} />
          <View style={styles.main}>
            <TouchableOpacity onPress={() => stopRecording()}>
              {gpt === 2 ? (
                <Image
                  source={require('../image/mainPage/Group 21.png')}
                  style={styles.mainImage}
                />
              ) : gpt === 1 ? (
                <Image
                  source={require('../image/mainPage/Group 20.png')}
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
          <Main_FakeV data={fake} />

          <View style={styles.main}>
            <TouchableOpacity onPress={() => detecting()}>
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
    marginTop: 28,
  },
});
export default Main;

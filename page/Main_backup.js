import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import Header from './Header';
// import { error } from '../component/error';

const Main = ({ route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [intervalId, setIntervalId] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const userNo = route.params.responseData;

  const url = 'http://192.168.0.165:8000/api';
  const startUrl = `http://192.168.0.165:8000/start/${userNo}`;
  const Detecting = async () => {
    try {
      const response = await axios.get(startUrl);
      console.log('Detecting...');
      setIsRecording(true);

      if (permissionResponse.status !== 'granted') {
        await requestPermission();
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      console.log('Starting recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecording(newRecording);

      if (newRecording) {
        const newIntervalId = setInterval(async () => {
          await sendRecording(newRecording);
          clearInterval(newIntervalId);
          Detecting();
        }, 10000);
        setIntervalId(newIntervalId);
      }
    } catch (e) {
      // error(e);
      console.log(e);
    }
  };

  const sendRecording = async (recording) => {
    try {
      if (!recording) {
        console.error('Recording is not available.');
        return;
      }

      if (recording._finalStatus === 'ERROR') {
        console.error('Recording encountered an error.');
        return;
      }

      if (recording._isDoneRecording) {
        console.log('Recording has already been unloaded.');
        return;
      }

      await recording.stopAndUnloadAsync();

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

      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // .then((data) => {
      //   console.log(data.data);
      // });
    } catch (error) {
      console.error('Error stopping and unloading recording:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      sendRecording(recording);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {isRecording ? (
        <View style={styles.recordingContainer}>
          <Text style={styles.recordingTitle}>보이스피싱 탐지 중</Text>
          <Text style={styles.percentage}>10%</Text>
          <Text style={styles.alert}>보이스 피싱일 확률이 적습니다.</Text>
          <TouchableOpacity onPress={stopRecording}>
            <Image
              source={require('../image/mainPage/Group 19.png')}
              style={styles.mainImage}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.nonRecordingContainer}>
          <Text style={styles.title}>보이스피싱 App입니다.</Text>
          <Text style={styles.alert}>이미지를 클릭하세요.</Text>
          <TouchableOpacity onPress={Detecting}>
            <Image
              source={require('../image/mainPage/Group 19.png')}
              style={styles.mainImage}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nonRecordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTitle: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  percentage: {
    color: 'white',
    fontSize: 48,
  },
  alert: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  mainImage: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Main;

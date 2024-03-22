import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Main_FakeV = (data) => {
  return (
    <View style={styles.container}>
      {data.data === 1 && (
        <View style={styles.alert}>
          <View style={styles.content}>
            <AntDesign name="warning" size={24} color="#d2691e" />
            <Text style={styles.text}>음성 변조가 감지됩니다.</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.1, // 부모 뷰를 전체 화면의 일부로 설정
    marginTop: 13,
  },
  alert: {
    backgroundColor: '#222222',
    border: '1px solid #7689fd',
    borderRadius: 5,
    padding: 5,
    zIndex: 100,
    position: 'absolute', // 절대 위치
    right: 20, // 오른쪽 끝에 배치
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row', // 자식 요소들을 가로 방향으로 나열
    alignItems: 'center', // 세로 방향에서 중앙 정렬
  },
  text: {
    marginLeft: 5,
    color: '#d2691e',
    fontSize: 23,
    fontWeight: '500',
    letterSpacing: -0.25,
  },
});

export default Main_FakeV;

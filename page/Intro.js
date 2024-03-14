import { Image, View, StyleSheet } from 'react-native';

const Intro = () => {
  return (
    <View style={styles.logo}>
      <Image
        source={require('../image/logo/logo_W.png')}
        style={styles.loadingImage}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImage: {
    width: 300,
    height: 300,
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Intro;

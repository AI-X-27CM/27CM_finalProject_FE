import { StyleSheet, View, Image } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image style={styles.logo} source={require('../image/logo/logo_W.png')} />
    </View>
  );
};
const styles = StyleSheet.create({
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
});
export default Header;

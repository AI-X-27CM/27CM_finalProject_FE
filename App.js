import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import Intro from './page/Intro';
import LoginPage from './page/Login';
import SignUpPage from './page/SignUp';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Main from './page/Main';
// import SocketTest from './page/SocketTest';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const Stack = createNativeStackNavigator();
  return (
    <View style={styles.container}>
      {isLoading ? (
        <Intro />
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#222222',
              },
              headerTintColor: 'grey',
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{
                headerTitleStyle: {
                  color: 'grey',
                },
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpPage}
              options={{
                headerTitleStyle: {
                  color: 'grey',
                },
              }}
            />
            <Stack.Screen
              name="Main"
              component={Main}
              options={{
                headerTitleStyle: {
                  color: 'grey',
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <StatusBar style={{ backgroundColor: 'white' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  headerStyle: {
    backgroundColor: '#222222',
  },
  headerFont: {
    color: '#fff',
  },
});

import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <Text style={{color: 'white', fontSize:45, fontWeight: 500, marginBottom: 40}}>News</Text>
        </View>

      <Text style={styles.header}>This is the home page</Text>
      <Link href="/Screen1" asChild>
        <TouchableOpacity activeOpacity={0.8} style={styles.button}>
          <Text style={styles.buttonText}>Go to Search Algorithm 1 (KMP)</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/Screen2" asChild>
        <TouchableOpacity activeOpacity={0.8} style={styles.button}>
          <Text style={styles.buttonText}>Go to Search Algorithm 2 (TRIES)</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 120, // Adjust the height as needed
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F2722D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
};

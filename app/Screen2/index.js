import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Trie from './Trie';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Page() {
  const [searchText, setSearchText] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trieMap, setTrieMap] = useState(new Map());
  const [generatedFileName, setGeneratedFileName] = useState('');
  const [savedFiles, setSavedFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/top-headlines?country=in&apiKey=505df58788274751a60f612c1143e4f7'
        );
        const data = await response.json();
        setNewsData(data.articles);
        await buildTrieMap(data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    const loadTrieMapFromStorage = async () => {
      try {
        const serializedTrieMap = await AsyncStorage.getItem('trieMap');
        if (serializedTrieMap) {
          setTrieMap(new Map(JSON.parse(serializedTrieMap)));
        }
      } catch (error) {
        console.error('Error loading TrieMap from storage:', error);
      }
    };

    fetchData();
    loadTrieMapFromStorage();
    loadSavedFiles();
  }, []);

  const buildTrieMap = async (articles) => {
    const newTrieMap = new Map(trieMap);

    articles.forEach((article) => {
      const trie = new Trie();
      const titleWords = article.title.toLowerCase().split(' ');
      titleWords.forEach((word) => {
        trie.insert(word);
      });

      newTrieMap.set(article.title, trie);
    });

    setTrieMap(newTrieMap);

    // Save the trieMap to storage after building
    try {
      const serializedTrieMap = JSON.stringify(Array.from(newTrieMap.entries()));
      await AsyncStorage.setItem('trieMap', serializedTrieMap);
      // Update the list of saved files
      loadSavedFiles();
    } catch (error) {
      // Handle the error
      console.error('Error saving TrieMap:', error);
    }
  };

  const loadSavedFiles = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const trieMapKeys = keys.filter((key) => key.startsWith('trieMap_'));
      setSavedFiles(trieMapKeys);
    } catch (error) {
      console.error('Error loading saved files:', error);
    }
  };

  const handleAggregate = async () => {
    try {
      await buildTrieMap(newsData);
      setGeneratedFileName(`trieMap_${new Date().getTime()}`);
      // No need to save trieMap here, as it's already saved in buildTrieMap
    } catch (error) {
      // Handle the error
      console.error('Error aggregating TrieMap:', error);
    }
  };

  const handleSearch = () => {
    if (!searchText) {
      setFilteredNews([]);
      return;
    }
  
    const filtered = newsData.filter((article) => {
      const titleWords = article.title.toLowerCase().split(' ');
      const articleTrie = new Trie();
      titleWords.forEach((word) => {
        articleTrie.insert(word);
      });
  
      return articleTrie.search(searchText.toLowerCase());
    });
  
    setFilteredNews(filtered);
  };
  

  const handleDeleteFile = async (fileName) => {
    try {
      await AsyncStorage.removeItem(fileName);
      // Update the list of saved files
      loadSavedFiles();
      Alert.alert('File Deleted', `The file ${fileName} has been deleted.`);
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'An error occurred while deleting the file.');
    }
  };

  const handleKeepFile = async () => {
    Alert.alert(
      'Keep File',
      `Do you want to keep the trieMap file ${generatedFileName}?`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            // Implement the logic to keep the file (if needed)
            Alert.alert('File Kept', `The file ${generatedFileName} has been kept.`);
            loadSavedFiles();
          },
        },
        {
          text: 'No',
          onPress: () => {
            // Implement the logic to delete the file (if needed)
            handleDeleteFile(generatedFileName);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderSavedFiles = () => {
    if (savedFiles.length === 0) {
      return <Text style={styles.savedFilesText}>No saved files available.</Text>;
    }

    return savedFiles.map((fileName) => (
      <View key={fileName} style={styles.savedFileItem}>
        <Text style={styles.savedFileName}>{fileName}</Text>
        <TouchableOpacity onPress={() => handleDeleteFile(fileName)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleKeepFile(fileName)}>
          <Text style={styles.keepButtonText}>Keep</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const renderNews = () => {
    const newsToRender = searchText ? filteredNews : newsData;

    return newsToRender.map((article, index) => (
      <View key={index} style={styles.newsCard}>
        <Text style={styles.newsTitle}>
          {highlightSearchTerm(article.title, searchText)}
        </Text>
        <Text style={styles.newsDescription}>
          {highlightSearchTerm(article.description, searchText)}
        </Text>
      </View>
    ));
  };

  const highlightSearchTerm = (text, term) => {
    if (!text || !term) {
      return text;
    }

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <Text key={index} style={styles.highlightText}>
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{color: 'white', marginBottom: 20, fontWeight: 800}}>Recommended for Frequent Searching, mainly for research porposes (USES a TRIE Data Structure)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a word to search"
        placeholderTextColor="#A9A9A9"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <TouchableOpacity
        style={styles.aggregateButton}
        onPress={generatedFileName ? handleSearch : handleAggregate}>
        <Text style={styles.buttonText}>{generatedFileName ? 'Search' : 'Aggregate'}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color="#F8D54D" style={styles.loader} />
        ) : renderNews()}
      </ScrollView>
      {generatedFileName && (
        <View style={styles.datFileInfo}>
          <Text style={styles.datFileName}>{generatedFileName}</Text>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  input: {
    backgroundColor: 'black',
    color: 'white',
    borderWidth: 1,
    borderColor: '#F8D54D',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  aggregateButton: {
    backgroundColor: '#F8D54D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
    marginTop: 20
  },
  savedFilesText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  sectionHeader: {
    color: '#F8D54D',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  savedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  savedFileName: {
    flex: 1,
    color: 'white',
  },
  deleteButtonText: {
    color: 'red',
    marginLeft: 10,
  },
  keepButtonText: {
    color: 'green',
    marginLeft: 10,
  },
  loader: {
    marginTop: 20,
  },
  newsCard: {
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  newsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsDescription: {
    color: 'white',
  },
  highlightText: {
    color: '#F8D54D', // Highlight color
    fontWeight: 'bold',
  },
  datFileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  datFileName: {
    color: '#F8D54D',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

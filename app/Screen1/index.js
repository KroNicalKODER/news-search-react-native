import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { kmpSearch } from './KMP';

export default function Page() {
  const [searchText, setSearchText] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/top-headlines?country=in&apiKey=505df58788274751a60f612c1143e4f7'
        );
        const data = await response.json();
        setNewsData(data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    setIsSearching(true)
    const filtered = newsData.filter((article) => {
      const title = article.title.toLowerCase();
      const pattern = searchText.toLowerCase();
      return kmpSearch(title, pattern) !== -1;      //SEARCH USING KMP ALGORITHM
    });
    
    setFilteredNews(filtered);
    setSearchPerformed(true);
    setIsSearching(false)
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

  const renderNews = () => {
    if (searchPerformed && searchText && filteredNews.length > 0) {
      return filteredNews.map((article, index) => (
        <View key={index} style={styles.newsCard}>
          <Text style={styles.newsTitle}>
            {highlightSearchTerm(article.title, searchText)}
          </Text>
          <Text style={styles.newsDescription}>
            {highlightSearchTerm(article.description, searchText)}
          </Text>
        </View>
      ));
    } else {
      return newsData.map((article, index) => (
        <View key={index} style={styles.newsCard}>
          <Text style={styles.newsTitle}>{article.title}</Text>
          <Text style={styles.newsDescription}>{article.description}</Text>
        </View>
      ));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{color: 'white', fontWeight:500, marginBottom: 10}}>Recommended For Non-Frequent Searches</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a word to search"
        placeholderTextColor="#A9A9A9"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <TouchableOpacity activeOpacity={0.85} style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{
          isSearching?'Searching':'Search'
        }</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color="#F8D54D" style={styles.loader} />
        ) : renderNews()}
      </ScrollView>
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
  button: {
    backgroundColor: '#F8D54D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
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
  loader: {
    marginTop: 20,
  },
  highlightText: {
    color: '#F8D54D',
    fontWeight: 'bold',
  },
};

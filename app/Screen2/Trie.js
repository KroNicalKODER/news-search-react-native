// TrieNode class
class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  // Trie class
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    search(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          return false;
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    async saveToStorage(fileName) {
      try {
        const serializedTrie = JSON.stringify(this.root);
        await AsyncStorage.setItem(fileName, serializedTrie);
      } catch (error) {
        console.error('Error saving Trie to storage:', error);
      }
    }
  
    async loadFromStorage(fileName) {
      try {
        const serializedTrie = await AsyncStorage.getItem(fileName);
        if (serializedTrie) {
          this.root = JSON.parse(serializedTrie);
        }
      } catch (error) {
        console.error('Error loading Trie from storage:', error);
      }
    }
  }
  
  export default Trie;
  
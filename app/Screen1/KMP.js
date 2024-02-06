export function kmpSearch(text, pattern) {
    const m = pattern.length;
    const n = text.length;
  
    if (m === 0) return 0; 
  
    const lps = computeLPSArray(pattern);
  
    let i = 0; 
    let j = 0; 
  
    while (i < n) {
      if (pattern[j] === text[i]) {
        i++;
        j++;
      }
  
      if (j === m) {
        return i - j; 
      } else if (i < n && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }
  
    return -1;
  }
  
  function computeLPSArray(pattern) {
    const m = pattern.length;
    const lps = Array(m).fill(0);
    let len = 0;
    let i = 1;
  
    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
  
    return lps;
  }
  
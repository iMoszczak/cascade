export class CascadeCipher {
  private createKeyTable(key: string): Map<string, number> {
    const keyTable = new Map<string, number>();
    const usedLetters = new Set<string>();
    
    // Assign numbers to key letters first
    for (let i = 0; i < key.length; i++) {
      const letter = key[i];
      if (!keyTable.has(letter)) {
        keyTable.set(letter, i + 1);
        usedLetters.add(letter);
      }
    }
    
    // Add remaining alphabet letters
    let nextValue = key.length + 1;
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i); // A-Z
      if (!usedLetters.has(letter)) {
        keyTable.set(letter, nextValue);
        nextValue++;
      }
    }
    
    return keyTable;
  }

  private createReverseKeyTable(keyTable: Map<string, number>): Map<number, string> {
    const reverseTable = new Map<number, string>();
    keyTable.forEach((value, letter) => {
      reverseTable.set(value, letter);
    });
    return reverseTable;
  }

  private validateInput(text: string, key: string): void {
    if (!/^[A-Z]+$/.test(key)) {
      throw new Error("Key must contain only uppercase letters A-Z");
    }
    if (key.length < 3) {
      throw new Error("Key must be at least 3 characters long");
    }
    if (!/^[A-Z\s]*$/.test(text)) {
      throw new Error("Text must contain only uppercase letters A-Z and spaces");
    }
  }

  private reverseGroups(text: string): string {
    // Remove spaces and pad to multiple of 5
    const cleanText = text.replace(/\s/g, '');
    const paddedText = cleanText.padEnd(Math.ceil(cleanText.length / 5) * 5, 'X');
    
    // Split into groups of 5 and reverse each group
    const groups = [];
    for (let i = 0; i < paddedText.length; i += 5) {
      const group = paddedText.substring(i, i + 5);
      groups.push(group.split('').reverse().join(''));
    }
    
    return groups.join('');
  }

  private unreverseGroups(text: string): string {
    // Split into groups of 5 and reverse each group back
    const groups = [];
    for (let i = 0; i < text.length; i += 5) {
      const group = text.substring(i, i + 5);
      groups.push(group.split('').reverse().join(''));
    }
    
    // Remove padding X's and restore spaces (simplified - original spaces are lost)
    return groups.join('').replace(/X+$/, '');
  }

  encrypt(message: string, key: string, startNumber: number, reverseGroups: boolean = false): string {
    this.validateInput(message, key);
    
    const keyTable = this.createKeyTable(key);
    let processedMessage = message.toUpperCase();
    
    // Remove spaces for processing
    const cleanMessage = processedMessage.replace(/\s/g, '');
    let result = '';
    let previousCipherValue = startNumber;
    
    for (let i = 0; i < cleanMessage.length; i++) {
      const letter = cleanMessage[i];
      const letterValue = keyTable.get(letter);
      
      if (letterValue === undefined) {
        throw new Error(`Invalid character: ${letter}`);
      }
      
      // Calculate cipher value
      const cipherValue = ((letterValue + previousCipherValue - 1) % 26) + 1;
      
      // Convert back to letter (1-26 maps to A-Z)
      const cipherLetter = String.fromCharCode(64 + cipherValue);
      result += cipherLetter;
      
      previousCipherValue = cipherValue;
    }
    
    // Apply reverse groups if requested
    if (reverseGroups) {
      result = this.reverseGroups(result);
    }
    
    return result;
  }

  decrypt(ciphertext: string, key: string, startNumber: number, reverseGroups: boolean = false): string {
    this.validateInput(ciphertext, key);
    
    const keyTable = this.createKeyTable(key);
    const reverseKeyTable = this.createReverseKeyTable(keyTable);
    let processedCiphertext = ciphertext.toUpperCase();
    
    // Unreverse groups if they were reversed
    if (reverseGroups) {
      processedCiphertext = this.unreverseGroups(processedCiphertext);
    }
    
    let result = '';
    let previousCipherValue = startNumber;
    
    for (let i = 0; i < processedCiphertext.length; i++) {
      const cipherLetter = processedCiphertext[i];
      
      // Convert cipher letter to its numeric value (A=1, B=2, ..., Z=26)
      const cipherValue = cipherLetter.charCodeAt(0) - 64;
      
      // Calculate original letter value
      let originalValue = cipherValue - previousCipherValue;
      if (originalValue <= 0) {
        originalValue += 26;
      }
      
      // Find the letter that maps to this value
      const originalLetter = reverseKeyTable.get(originalValue);
      
      if (originalLetter === undefined) {
        throw new Error(`Cannot decrypt character at position ${i}`);
      }
      
      result += originalLetter;
      previousCipherValue = cipherValue;
    }
    
    // Remove padding X's if present
    return result.replace(/X+$/, '');
  }
}

export const cascadeCipher = new CascadeCipher();

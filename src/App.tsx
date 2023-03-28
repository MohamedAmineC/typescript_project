import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from './wordlist.json';

function getWord(){
  return words[Math.floor(Math.random() * words.length)];
}


function App() {
  const [wordToguess,setWordToguess] = useState(getWord);

  const [guessedLetters,setGuessedLetters] = useState<string[]>([])
  console.log(wordToguess);

  const incorrectLettes = guessedLetters.filter(letter => !wordToguess.includes(letter));

  const isLoser = incorrectLettes.length >= 6
  const isWinner = wordToguess.split("").every(letter => guessedLetters.includes(letter));

 
  const addGuessedLetter = useCallback((letter:string) => {
    if(guessedLetters.includes(letter) || isLoser || isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters,letter]);
  },[guessedLetters,isLoser,isWinner])

  useEffect(() => {
    const handler = (e:KeyboardEvent) => {
      const key = e.key;
      if(!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key)
    }
    document.addEventListener("keypress",handler)
    return () => {
      document.removeEventListener("keypress",handler)
    }
  },[guessedLetters])

  useEffect(() => {
    const handler = (e:KeyboardEvent) => {
      const key = e.key;
      if(key !== 'Enter') return;
      e.preventDefault();
      setGuessedLetters([]);
      setWordToguess(getWord());
    }
    document.addEventListener("keypress",handler)
    return () => {
      document.removeEventListener("keypress",handler)
    }
  })

  return(
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center"
    }}>
      <div style={{
        fontSize: "2rem", textAlign: "center"
      }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice try - Refresh to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLettes.length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToguess} />
      <div style={{alignSelf:"stretch"}}>
        <Keyboard activeLetters={guessedLetters.filter(letter => wordToguess.includes(letter))} 
        inactiveLetters={incorrectLettes}
        addGuessedLetter={addGuessedLetter}
        disabled = {isWinner || isLoser}
        />
      </div>
    </div>
  )
}

export default App

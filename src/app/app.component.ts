import { Component, HostListener } from '@angular/core';
import { State } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  state = State.InPreparation;
  wordToGuess = "";
  guessedLetters: string[] = [];
  wrongGuessedLetters: string[] = [];
  currentImage = './assets/00-hangman.png'

  submit(word: string) {
    this.wordToGuess = word.toUpperCase();
    this.state = State.InGame;
  }

  isInPreparation() {
    return this.state == State.InPreparation;
  }

  isInGame() {
    return this.state == State.InGame;
  }

  isWinner() {
    return this.state == State.Winner;
  }

  isLoser() {
    return this.state == State.Loser;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.state == State.InGame) {
      let key = event.key.toUpperCase();

      if (this.contains(this.wordToGuess, key)) {
        this.guessedLetters.push(key);
      } else {
        this.wrongGuessedLetters.push(key);
        this.updateImage();
      }

      if (this.isCompleted()) {
        console.log('Juhu!');
        this.state = State.Winner;
      }
      if (this.isFail()) {
        console.log('XX');
        this.state = State.Loser;
      }
    }
  }

  getLetterAt(index: number): string {
    let letterAtIndex = this.wordToGuess.charAt(index);

    if (this.isGuessedCorrectly(letterAtIndex)) {
      return letterAtIndex;
    }

    return '_';
  }

  private isCompleted(): boolean {
    for (let i = 0; i < this.wordToGuess.length; i++) {
      let letter = this.wordToGuess.charAt(i);

      if (!(this.isGuessedCorrectly(letter))) {
        return false;
      }
    }

    return true;
  }

  private isFail(): boolean {
    return this.wrongGuessedLetters.length >= 10;
  }

  isGuessedCorrectly(letter): boolean {
    return this.contains(this.guessedLetters, letter);
  }

  private contains(word, letter): boolean {
    return word.indexOf(letter) > -1;
  }

  private updateImage() {
    let fails = this.wrongGuessedLetters.length;
    let formatted = fails.toString();

    if (formatted.length == 1) {
      formatted = '0' + formatted;
    }

    this.currentImage = `./assets/${formatted}-hangman.png`;
  }

  filterChars(event: any) {
    const pattern = /[A-Za-zÄäÖöÜüß]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}

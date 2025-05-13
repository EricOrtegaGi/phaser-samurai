import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentLevel: 1,
    score: 0,
    lives: 3,
    isGamePaused: false,
    isLoading: false,
    gameState: 'menu', // menu, playing, paused, gameOver
    highScores: [],
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'normal'
    }
  }),

  getters: {
    isGameOver: (state) => state.lives <= 0,
    currentHighScore: (state) => Math.max(...state.highScores, 0)
  },

  actions: {
    startGame() {
      this.gameState = 'playing'
      this.score = 0
      this.lives = 3
      this.isGamePaused = false
    },

    pauseGame() {
      this.isGamePaused = true
      this.gameState = 'paused'
    },

    resumeGame() {
      this.isGamePaused = false
      this.gameState = 'playing'
    },

    gameOver() {
      this.gameState = 'gameOver'
      this.highScores.push(this.score)
    },

    setLoading(loading) {
      this.isLoading = loading
    },

    updateScore(points) {
      this.score += points
    },

    loseLife() {
      this.lives--
      if (this.lives <= 0) {
        this.gameOver()
      }
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
    }
  }
}) 
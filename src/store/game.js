import { defineStore } from 'pinia'
import { debounce } from 'lodash'

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
    },
    gameProgress: 0,
    lastSaveTime: null,
    debugMode: false
  }),

  getters: {
    isGameOver: (state) => state.lives <= 0,
    currentHighScore: (state) => Math.max(...state.highScores, 0),
    isHighScore: (state) => state.score > Math.max(...state.highScores, 0),
    gameProgress: (state) => (state.score / 1000) * 100,
    timeSinceLastSave: (state) => state.lastSaveTime ? Date.now() - state.lastSaveTime : 0
  },

  actions: {
    startGame() {
      this.gameState = 'playing'
      this.score = 0
      this.lives = 3
      this.isGamePaused = false
      this.lastSaveTime = Date.now()
      this.persistGameState()
    },

    pauseGame() {
      this.isGamePaused = true
      this.gameState = 'paused'
      this.persistGameState()
    },

    resumeGame() {
      this.isGamePaused = false
      this.gameState = 'playing'
    },

    gameOver() {
      this.gameState = 'gameOver'
      this.highScores.push(this.score)
      this.persistGameState()
    },

    setLoading(loading) {
      this.isLoading = loading
    },

    updateScore: debounce(function(points) {
      this.score += points
      this.persistGameState()
    }, 100),

    loseLife() {
      this.lives--
      if (this.lives <= 0) {
        this.gameOver()
      }
      this.persistGameState()
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      this.persistGameState()
    },

    persistGameState() {
      const gameState = {
        score: this.score,
        lives: this.lives,
        highScores: this.highScores,
        settings: this.settings,
        currentLevel: this.currentLevel
      }
      localStorage.setItem('gameState', JSON.stringify(gameState))
      this.lastSaveTime = Date.now()
    },

    loadGameState() {
      const savedState = localStorage.getItem('gameState')
      if (savedState) {
        const state = JSON.parse(savedState)
        this.score = state.score
        this.lives = state.lives
        this.highScores = state.highScores
        this.settings = state.settings
        this.currentLevel = state.currentLevel
      }
    },

    toggleDebugMode() {
      this.debugMode = !this.debugMode
    }
  }
}) 
export class GameState {
  constructor() {
    this.states = new Map();
    this.currentState = null;
    this.stateHistory = [];
  }

  addState(name, state) {
    this.states.set(name, state);
  }

  changeState(name, data = {}) {
    if (this.currentState && this.currentState.exit) {
      this.currentState.exit();
      this.stateHistory.push(this.currentState);
    }
    this.currentState = this.states.get(name);
    if (this.currentState && this.currentState.enter) {
      this.currentState.enter(data);
    }
  }

  previousState() {
    if (this.stateHistory.length > 0) {
      const previousState = this.stateHistory.pop();
      this.changeState(previousState.name);
    }
  }

  getCurrentState() {
    return this.currentState;
  }
}

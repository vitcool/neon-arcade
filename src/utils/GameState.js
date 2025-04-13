export class GameState {
  constructor() {
    this.games = ['platformer', 'racer', 'puzzle'];
    this.loadScores();
  }

  loadScores() {
    this.scores = {};
    this.games.forEach(game => {
      const savedScores = localStorage.getItem(`neonArcade.${game}.scores`);
      this.scores[game] = savedScores ? JSON.parse(savedScores) : [];
    });
  }

  addScore(game, score) {
    if (!this.games.includes(game)) return;
    
    this.scores[game].push(score);
    this.scores[game].sort((a, b) => b - a);
    this.scores[game] = this.scores[game].slice(0, 5);
    
    localStorage.setItem(
      `neonArcade.${game}.scores`,
      JSON.stringify(this.scores[game])
    );
  }

  getTopScores(game) {
    return this.scores[game] || [];
  }

  getAllScores() {
    return this.scores;
  }
}

export class DebugSystem {
  constructor(scene) {
    this.scene = scene;
    this.metrics = {
      fps: 0,
      memory: 0,
      objects: 0,
      drawCalls: 0
    };
    this.enabled = false;
    this.debugText = null;
  }

  init() {
    this.debugText = this.scene.add.text(10, 10, '', {
      fontSize: '16px',
      fill: '#fff'
    });
    this.debugText.setScrollFactor(0);
  }

  update() {
    if (!this.enabled) return;
    this.metrics.fps = this.scene.game.loop.actualFps;
    this.metrics.memory = performance.memory?.usedJSHeapSize || 0;
    this.metrics.objects = this.scene.game.scene.scenes.length;
    this.metrics.drawCalls = this.scene.game.renderer.drawCalls || 0;
    this.debugText.setText([
      `FPS: ${Math.round(this.metrics.fps)}`,
      `Memory: ${Math.round(this.metrics.memory / 1024 / 1024)}MB`,
      `Objects: ${this.metrics.objects}`,
      `Draw Calls: ${this.metrics.drawCalls}`
    ].join('\n'));
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.debugText) {
      this.debugText.setVisible(this.enabled);
    }
  }
}

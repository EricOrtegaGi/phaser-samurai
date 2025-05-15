class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.loadingPromises = new Map();
  }

  async preload(scene, resources) {
    const promises = [];
    for (const [key, resource] of Object.entries(resources)) {
      const promise = new Promise((resolve, reject) => {
        if (resource.type === 'image') {
          scene.load.image(key, resource.path);
        } else if (resource.type === 'spritesheet') {
          scene.load.spritesheet(key, resource.path, resource.config);
        } else if (resource.type === 'audio') {
          scene.load.audio(key, resource.path);
        }
        scene.load.once('complete', () => resolve());
        scene.load.once('loaderror', (file) => reject(file));
      });
      promises.push(promise);
      this.loadingPromises.set(key, promise);
    }
    return Promise.all(promises);
  }

  get(key) {
    return this.resources.get(key);
  }

  set(key, resource) {
    this.resources.set(key, resource);
  }

  clear() {
    this.resources.clear();
    this.loadingPromises.clear();
  }
}

export default new ResourceManager();

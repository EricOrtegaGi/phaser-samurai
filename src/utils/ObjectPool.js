export class ObjectPool {
  constructor(createFn, initialSize = 10) {
    this.createFn = createFn;
    this.pool = [];
    this.active = new Set();
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get() {
    const obj = this.pool.pop() || this.createFn();
    this.active.add(obj);
    return obj;
  }

  release(obj) {
    if (this.active.has(obj)) {
      this.active.delete(obj);
      this.pool.push(obj);
    }
  }

  clear() {
    this.pool = [];
    this.active.clear();
  }

  getActiveCount() {
    return this.active.size;
  }

  getPoolSize() {
    return this.pool.length;
  }
}

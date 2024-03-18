class MiniStore<T> {
  private subscriptions: Set<() => void> = new Set<() => void>();
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = () => {
    return this.state;
  };

  update = async (partialNewState: Partial<T>) => {
    this.state = {...this.state, ...partialNewState};

    this.subscriptions.forEach(cb => {
      cb();
    });
  };

  subscribe = (cb: () => void) => {
    this.subscriptions.add(cb);

    return () => {
      this.subscriptions.delete(cb);
    };
  };
}

export {MiniStore};

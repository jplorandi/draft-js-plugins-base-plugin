export class ListenerBus {
  constructor() {
    this.listeners = [];
  }

  subscribe(event, callback) {
    this.listeners.push({event: event, callback: callback});
  }

  unsubscribe(event, callback) {
    this.listeners = this.listeners.filter((listener) => {
      if (listener.event !== event && listener.callback !== callback) {
        return listener;
      }
      return null;
    });
  }

  fireEvent(name, ...args) {
    this.listeners.forEach((listener) => {
      if (listener.event === name) {
        listener.callback(args);
      }
    });
  }

}

export default ListenerBus;

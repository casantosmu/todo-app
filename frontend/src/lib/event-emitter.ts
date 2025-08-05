import type { SyncStatus } from "@/modules/sync/models/sync-status";

export interface AppEvents {
  "sync:push": {
    tableName: string;
    data: unknown[];
  };
  "sync:pull": {
    tableName: string;
    data: unknown[];
  };
  "sync:status-change": {
    status: SyncStatus;
  };
}

type Listener<T> = (data: T) => Promise<void> | void;

class EventEmitter<Events extends AppEvents> {
  private listeners: { [K in keyof Events]?: Listener<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    this.listeners[event] ??= [];
    this.listeners[event].push(listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }

  async emit<K extends keyof Events>(event: K, data: Events[K]) {
    const listeners = this.listeners[event];
    if (!listeners) {
      return;
    }

    const promises = listeners.map((listener) =>
      Promise.resolve(listener(data)),
    );
    await Promise.all(promises);
  }
}

export const eventEmitter = new EventEmitter();

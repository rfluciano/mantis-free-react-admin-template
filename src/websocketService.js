  // websocketService.js
  import Pusher from 'pusher-js';

  class WebSocketService {
    constructor() {
      this.pusher = null;
      this.channels = {};
      this.subscribers = {};
    }

    // Initialize Pusher
    init(pusherKey, cluster) {
      if (!this.pusher) {
        Pusher.logToConsole = true; // For debugging (disable in production)
        this.pusher = new Pusher(pusherKey, {
          cluster: cluster,
          forceTLS: true, // Use HTTPS for WebSocket connections
          transports: ['websocket', 'polling', 'xhr_streaming'], // Fallback mechanisms
        });
      }
    }

    // Subscribe to a channel and bind to an event
    subscribe(channelName, eventName, callback) {
      if (!this.channels[channelName]) {
        this.channels[channelName] = this.pusher.subscribe(channelName);
      }

      // Bind the event and store the callback
      if (!this.subscribers[channelName]) {
        this.subscribers[channelName] = {};
      }

      if (!this.subscribers[channelName][eventName]) {
        this.subscribers[channelName][eventName] = [];
      }

      this.subscribers[channelName][eventName].push(callback);

      this.channels[channelName].bind(eventName, (data) => {
        this.subscribers[channelName][eventName].forEach((cb) => cb(data));
      });
    }

    // Unsubscribe from an event
    unsubscribe(channelName, eventName, callback) {
      if (
        this.subscribers[channelName] &&
        this.subscribers[channelName][eventName]
      ) {
        this.subscribers[channelName][eventName] = this.subscribers[channelName][eventName].filter(
          (cb) => cb !== callback
        );

        if (this.subscribers[channelName][eventName].length === 0) {
          this.channels[channelName].unbind(eventName);
        }
      }
    }

    // Disconnect Pusher
    disconnect() {
      if (this.pusher) {
        this.pusher.disconnect();
      }
    }
  }

  const websocketService = new WebSocketService();
  export default websocketService;

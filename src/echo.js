// // import Pusher from "pusher-js";
// // import Echo from "laravel-echo";


// // window.Pusher = Pusher;

// // window.Echo = new Echo({
// //     brodcaster: 'reverb',
// //     key: import.meta.env.VITE_REVERB_APP_KEY,
// //     wsHost: import.meta.env.VITE_REVERB_HOST,
// //     whPort: import.meta.env.VITE_REVERB_PORT ?? 80,
// //     wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
// //     forceTLS :(import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'http',
// //     enableTransports: ['ws' , 'wss'],
// // })


import Pusher from "pusher-js";
import Echo from "laravel-echo";

window.Pusher = Pusher;

window.Echo.channel('my-channel')
    .listen('MyEvent', (event) => {
        console.log('Received message:', event.message);  // Logs 'Hello, World!'
    });


const echo = new Echo({
    broadcaster: "pusher",
    key: "local",
    wsHost: "127.0.0.1",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});

export default echo;
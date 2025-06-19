// import { useEffect, useRef, useState, useCallback } from 'react';
// import { io, Socket } from 'socket.io-client';

// const useSocket = (url: string, token?: string) => {
//   const [message, setMessage] = useState<any>(null);
//   const [connected, setConnected] = useState(false);
//   const socketRef = useRef<Socket | null>(null);

//   const sendMessage = useCallback((event: string, payload?: any) => {
//     if (socketRef.current && connected) {
//       console.log(`💥 Sending event: ${event}`, payload);
//       socketRef.current.emit(event, payload);
//       return true;
//     }
//     console.error('💥 Socket.IO is not connected.');
//     return false;
//   }, [connected]);

//   const requestBalance = useCallback(() => {
//     sendMessage('request_balance');
//   }, [sendMessage]);

//   useEffect(() => {
//     console.log('💥 Initializing Socket.IO connection');

//     const socket = io(url, {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       query: { token }
//     });

//     socketRef.current = socket;

//     const onConnect = () => {
//       console.log('💥 Socket.IO connected');
//       setConnected(true);
//     };

//     const onDisconnect = (reason: string) => {
//       console.log(`💥 Socket.IO disconnected: ${reason}`);
//       setConnected(false);
//     };

//     const onBalanceUpdate = (data: any) => {
//       console.log("💥 Received balance_update:", data);
//       setMessage(data);
//     };

//     const onConnectError = (err: Error) => {
//       console.error('💥 Socket.IO connection error:', err.message);
//     };

//     socket.on('connect', onConnect);
//     socket.on('disconnect', onDisconnect);
//     socket.on('balance_update', onBalanceUpdate); // Обработчик для обновлений
//     socket.on('connect_error', onConnectError);

//     return () => {
//       console.log('💥 Cleaning up Socket.IO connection');
//       socket.off('connect', onConnect);
//       socket.off('disconnect', onDisconnect);
//       socket.off('balance_update', onBalanceUpdate);
//       socket.off('connect_error', onConnectError);
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [url, token]); // Добавляем токен в зависимости

//   return { message, connected, sendMessage, requestBalance };
// };

// export default useSocket;


import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const createSocket = (url: string, accessToken?: string) => {
  if (!socket) {
    socket = io(url, {
      transports: ['websocket'],
      query: { token: accessToken },
      reconnection: true, // Включаем автоматическое повторное подключение
      reconnectionAttempts: 5, // Количество попыток повторного подключения
      reconnectionDelay: 1000, // Задержка между попытками повторного подключения
    });

    socket.on('connect', () => {
      console.log('WebSocket подключение установлено');
    });

    socket.on('connect_error', (err) => {
      console.log('Ошибка подключения:', err);
    });

    socket.on('error', (err) => {
      console.log('Ошибка сокета:', err);
    });
  }
  return socket;
};

const useWebSocket = (url: string, accessToken?: string): Socket | null => {
  const [readySocket, setReadySocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = createSocket(url, accessToken);
    setReadySocket(newSocket);

    return () => {
      // Не отключаем socket, чтобы сохранить синглтон
      // Очистка подписок будет в компоненте
    };
  }, [url, accessToken]);

  return readySocket;
};

export default useWebSocket;

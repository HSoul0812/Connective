import { Server, Socket } from 'socket.io';
import { Events } from './events';

export const StartSocketConnection = (server: Server) => {
    server.on(Events.CONNECTION as string, (socket) => {
        console.log('a user connected');
        socket.on(Events.DISCONNECT, () => {
            console.log('user disconnected');
        });
        socket.on(Events.SEND_MESSAGE, (message: any) => {
            if (typeof Events.NEW_MESSAGE_TO_ID === 'function') {
                server.sockets.emit(
                    Events.NEW_MESSAGE_TO_ID(
                        `${message.sender}_${message.receiver}`
                    ),
                    {
                        ...message,
                    }
                );
            }
        });
    });
};

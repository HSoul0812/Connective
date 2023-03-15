import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import { ironSession } from 'iron-session/express';
import { Server } from 'socket.io';
import { socketMiddleware } from './socket/socket.middleware';
import { route } from './socket/socket.routes';

dotenv.config();
const app = express();
const server = new http.Server(app);
const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: process.env.CROSS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});

app.use(cors({ origin: process.env.CROSS_ORIGIN, credentials: true }));

const session = ironSession({
    cookieName: 'Connective',
    password: process.env.APPLICATION_SECRET as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
});

app.get('/ping', async (req: Request, res: Response) => {
    res.json({});
});

app.use('/socket', session, route);

if (process.env.NODE_ENV === 'development') {
    app.use(express.static(__dirname + '/public'));
}

socketMiddleware(io);

server.listen(process.env.PORT, () => {
    console.log(`🔔 ${process.env.NODE_ENV} server is up on`, process.env.PORT);
});

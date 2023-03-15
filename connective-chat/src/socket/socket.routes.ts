import { Router, RouterOptions } from 'express';
import { SocketController, socketController } from './socket.contorller';

export const route = Router();

export class SocketRoutes {
    constructor(
        private router: Router,
        private socketController: SocketController
    ) {
        this.router.get(
            '/connection/key/:userId',
            this.socketController.getConnectionKey
        );
    }
}

const socketRoutes = new SocketRoutes(route, socketController);

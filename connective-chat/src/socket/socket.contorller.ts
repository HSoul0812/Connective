import { Request, Response } from 'express';
import { SocketService, socketService } from './socket.service';
import { UserSession } from './types';

export class SocketController {
    constructor(private socketService: SocketService) {}

    public getConnectionKey = (req: Request, res: Response) => {
        const userSession: UserSession = req.session as unknown as UserSession;
        const { userId } = req.params;
        if (String(userSession?.user?.id) === userId) {
            const key = this.socketService.getEncryptedKeyForUserId(userId);
            res.json({
                key,
            });
            return;
        }
        res.sendStatus(403);
    };
}

export const socketController = new SocketController(socketService);

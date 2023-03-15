import { v4 as uuidv4 } from 'uuid';
import { UserIdsByConnectionKeys } from '../connection-maps/connection-keys.map';

export class SocketService {
    constructor() {}

    public getEncryptedKeyForUserId(userId: string) {
        const key = uuidv4();
        UserIdsByConnectionKeys.set(key, userId);
        Buffer.from(key).toString('base64');
        return Buffer.from(key).toString('base64');
    }

    public getDecryptedKey(token: string): string {
        return Buffer.from(token, 'base64').toString('utf-8');
    }

    public verifyKeyForUserId(token: string): boolean {
        const decryptedKey = this.getDecryptedKey(token);
        return Boolean(UserIdsByConnectionKeys.get(decryptedKey));
    }

    public removeTokenFromConnectionKeys(token: string): void {
        const decryptedKey = this.getDecryptedKey(token);
        UserIdsByConnectionKeys.delete(decryptedKey);
    }
}

export const socketService = new SocketService();

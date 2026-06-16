import { AuthService } from '../auth/provider/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        userId: any;
    }>;
}

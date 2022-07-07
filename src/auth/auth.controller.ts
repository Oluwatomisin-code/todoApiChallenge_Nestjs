import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import RefreshTokenDto from './dto/refreshToken.dto';
import RefreshToken from './entities/refresh-token.entity';
import { user } from './user.model';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}



    @Post('local/signin')
    signinLocal(@Body() dto:AuthDto){
        return this.authService.signinLocal(dto)
    }

    @Post('local/signup')
    async signupLocal(@Body() dto:AuthDto): Promise<user>{
        return await this.authService.signupLocal(dto)
    }

    @Post('local/tokenrefresh')
    async requestToken(@Body() body: RefreshTokenDto) :Promise<{accessToken: string; refreshToken: string} | undefined>{
        return await this.authService.refresh(body.refreshToken)
    }

}

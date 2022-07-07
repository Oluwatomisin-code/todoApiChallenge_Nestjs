import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { sign,verify } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { AuthDto } from './dto';
import RefreshToken from './entities/refresh-token.entity';
import { user } from './user.model';
const users= require ("./users.json")

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('users') private readonly userModel: Model<user>
        ){}

    private refreshTokens: RefreshToken[]=[]

    //signin logic
    async signinLocal(dto: AuthDto): Promise<{accessToken:string; refreshToken:string}|undefined>{
        // retrieve user
        // const user = await users.find(_user => _user.email === dto.email)
        const user = await this.userModel.findOne({email: dto.email})
        if(!user) throw new UnauthorizedException('credentials incorrect')

        if(user.password !== dto.password) throw new UnauthorizedException('credentials incorrect')

        return await this.newRefreshAccessToken(user)
    }

    //signup logic
    async signupLocal(dto: AuthDto): Promise<user>{
        if (dto.email=== '' || dto.password === ''){
            throw new BadRequestException('please provide complete credentials')
        }

        const newUser = new this.userModel({
            email:dto.email,
            password: dto.password
        })
        
        const newSave = await newUser.save()
        
        return newSave
    }

    //get new refresh and access token
    private async newRefreshAccessToken(
        user:any,
    ):Promise<{accessToken: string; refreshToken: string} | undefined>{
        const refreshObject = new RefreshToken({
            id: this.refreshTokens.length===0
                    ? 0
                    : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
            userId:user.id
        });
        this.refreshTokens.push(refreshObject)

        
            const refreshToken= refreshObject.sign();
            const accessToken= sign({
                userId: user.id
            }, "secretsecret", {
                expiresIn:'15m'
            })

            const updateRefreshTokeninDb = await this.userModel.findByIdAndUpdate({_id:user.id},{token: refreshToken})
            console.log(updateRefreshTokeninDb)
            if(!updateRefreshTokeninDb)  throw new BadRequestException('provide your refresh token')
            return{
                refreshToken,
                accessToken
            }
        
    }

    //verify refresh token
    private retrieveRefreshToken(refreshStr: string): Promise<RefreshToken | undefined>{
        try{
            const decoded = verify(refreshStr, "secretforRefresh")
            if(typeof decoded === 'string'){
                
                return undefined
            }
            return Promise.resolve(
                this.refreshTokens.find((token)=> token.id === decoded.id)
            )
        }catch(e){
            console.log(e)
           return undefined 
        }
    }

    //get new access token on expiry
    async refresh (refreshStr: string): Promise<{accessToken: string; refreshToken: string} | undefined>{
        if(!refreshStr) throw new BadRequestException('provide your refresh token')
        const checkTokenInDb = this.userModel.findOne({token:refreshStr})
        if(!checkTokenInDb) throw new BadRequestException('refresh token not valid')
        const refreshToken = await this.retrieveRefreshToken(refreshStr);
        if(!refreshToken){
            throw new BadRequestException('refresh token not found')
        }
        console.log(refreshToken.userId)
        // const user = await users.find(user=> user.id === refreshToken.userId)
        const user = await this.userModel.findOne({_id: refreshToken.userId, token: refreshStr})
        console.log(user)
        if(!user){
            throw new BadRequestException('provided refresh token not associated with user')
        }
    
        return await this.newRefreshAccessToken(user)
    }

    // signUser(userId: number, email: string){
    //     return this.jwtService.sign({
    //         sub: userId,
    //         email
    //     })
    // }
}

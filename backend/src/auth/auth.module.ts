import { Module } from "@nestjs/common"
import {AuthService} from "./auth.service"
import {JwtStrategy} from "./auth.strategy"
import {JwtGuard} from "./auth.guard"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import {AuthController }from "./auth.controller"

@Module({
    imports: [JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>('JWT_SECRET'),
            signOptions: {
                expiresIn: "1d"
            }
        })
    }), PassportModule, ConfigModule],
    controllers : [AuthController],
    providers: [AuthService, JwtGuard, JwtStrategy],
    exports: [JwtGuard, AuthService,JwtStrategy]
})

export class AuthModule { }
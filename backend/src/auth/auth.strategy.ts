import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import {PrismaService} from "../prisma/primsa.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private configService: ConfigService,
    private db: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    })
  }

  async validate(payload: any) {

    const user = await this.db.user.findFirst({
      where: {
        email: payload.email
      }
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return user
  }
}
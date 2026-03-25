import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/primsa.service"
import { comparePassword, hashPassword } from "./helper/password.helper"
import { generateJwtToken } from "./util/jwt.utl"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async registerUser(name, username, email, password) {

        try {
            if (!name || !username || !email || !password) {
                throw new BadRequestException('all fields are required')
            }

            console.log("register service")
            const existedUser = await this.prisma.user.findFirst({
                where: { email }
            })
            console.log("existed user ran")

            if (existedUser) {
                return {
                    message: `${email} is already registred`,
                    status: 202
                }
            }

            const hash = await hashPassword(password)

            const user = await this.prisma.user.create({
                data: {
                    name,
                    username,
                    email,
                    password: hash,
                    bio:""
                }
            })

           const loginRes = this.login(email, password)

            return {
                message: `user sucessfuly is registred`,
                status: 200,
                user,
                sucess: true,
                loginRes
            }

        } catch (e: any) {
            return {
                message: "internal server error",
                status: 500,
                error: e.message,
                sucess: true
            }
        }
    }

    async login(identifier: string, password: string) {
        try {



            if (!identifier) {
                return {
                    message: "email or username is required",
                    status: 202
                }
            }
            if (!password) {
                return {
                    message: "password is required",
                    status: 202
                }
            }

            const found = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: identifier },
                        { username: identifier }
                    ]
                }
            })

            const email = found?.email!
            if (!found) {
                throw new UnauthorizedException(`user with ${identifier} not exist`)
            }

            const checkPassword = await comparePassword(password, found.password)

            if (!checkPassword) {
                throw new UnauthorizedException('incorrect password')
            }

            const token = await generateJwtToken({ email }, this.jwtService)

            return {
                message: "Login sucessful",
                sucess: true,
                user: found,
                jwtToken: token
            }

        } catch (e) {
            return {
                message: "internal server error",
                status: 500,
                error: e.message,
                sucess: false
            }
        }
    }
}
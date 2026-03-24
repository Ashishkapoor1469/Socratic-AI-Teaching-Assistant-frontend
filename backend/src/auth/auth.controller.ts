import { Body, Controller, Get, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { authApi } from "./api"
import {IsPublic} from "../decorator/isPublic.decorator"

@Controller("api/auth")
export class AuthController {
    constructor(private Auth: AuthService) { }

    @Get("health")
    getHelth() {
        return authApi
    }

    @IsPublic()
    @Post("register")
    async register(@Body() body: { name: string, username: string, email: string, password: string }) {
        const { username, email, name, password } = body
        console.log(username, name, password, email)
        return this.Auth.registerUser(username, name, email, password)

    }

    @IsPublic()
    @Post("login")
    async login(@Body() body: { identifier: string, password: string }) {

        const { identifier, password } = body

        return this.Auth.login(identifier, password)

    }


}
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/primsa.service"

enum SelectAssistent {
    socratic,
    direct,
    creative,
    evaluator
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUser(identifier) {
        try {
            if (!identifier) throw new UnauthorizedException("emial or username is required")
            const user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: identifier },
                        { username: identifier }
                    ]}})
            if (!user) throw new UnauthorizedException('user not found')
            return { message: "user found", statusbar: 200, user, sucess: true }
        } catch (e) {
            return { message: "internal server error", status: 500, sucess: false }
        }
    }

    async updateUser(name?: string, bio?: string, assistant?: string) {
        const data: any = {};
        if (name !== undefined) data.name = name;
        if (bio !== undefined) data.bio = bio;
        if (assistant !== undefined) data.assistant = assistant;
        return await this.prisma.user.updateMany({data});
    }
}
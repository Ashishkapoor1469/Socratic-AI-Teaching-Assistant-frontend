import {Module,Global} from "@nestjs/common"
import {PrismaService} from "./primsa.service"
import {ConfigModule} from "@nestjs/config"

@Global() 
@Module({
    imports: [ConfigModule],
    providers:[PrismaService],
    exports:[PrismaService]
})

export class PrismaModule {}
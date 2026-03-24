import {Module} from "@nestjs/common"
import {ModelService} from "./model/model.service"
import {AgentService} from './agent.service'
@Module({
    providers : [ModelService,AgentService],
    controllers :[],
    exports :[AgentService]
})

export class AgentModule {}
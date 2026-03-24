import { BadRequestException, Injectable } from "@nestjs/common";
import { ModelService } from "./model/model.service";

@Injectable()
export class AgentService {
  constructor(private model: ModelService) {}

  async *chatStream(messages: any[] | string) {
    if (!messages || messages.length === 0) {
      throw new BadRequestException("messages are required");
    }

    yield* this.model.chatStream(messages);
  }
}
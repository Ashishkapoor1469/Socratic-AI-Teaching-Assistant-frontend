import { Controller, Post, Body, Res } from "@nestjs/common"
import { ChatService } from "./chat.service"
import express from "express"
import { modes } from "../agent/type/mode.type"

@Controller("api/chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post("new")
  async newChat(@Body() body: { email: string; title: string }) {
    const { email, title } = body
    return this.chatService.newChat(email, title)
  }

  @Post("stream")
  async streamChat(
    @Body() body: { message: string; chatId: string; mode: modes },
    @Res() res: express.Response
  ) {
    const { message, chatId, mode } = body
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()
    await this.chatService.handleStream(message, chatId, mode, res)
  }

  @Post("test")
  async generateTest(@Body() body: { topic: string; chatId: string }) {
    const { topic, chatId } = body
    return this.chatService.generateTest(topic, chatId)
  }

  @Post("get")
  async getChatMessages(@Body() body: { chatId: string; email: string }) {
    const { chatId, email } = body
    return this.chatService.getChatHistory(chatId, email)
  }

  @Post("getchat")
  async getChat(@Body() body: { userId: string }) {
    const { userId } = body
    return this.chatService.getChat(userId)
  }

  @Post("delete")
  async deleteChat(@Body() body: { chatId: string }) {
    const { chatId } = body
    return this.chatService.deleteChat(chatId)
  }

  @Post("rename")
  async renameChat(@Body() body: {chatId: string, title:string}){
    const {chatId,title} = body
    return this.chatService.renameChat(chatId,title)
  }

}
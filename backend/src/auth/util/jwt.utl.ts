import { JwtService } from "@nestjs/jwt";

type TPayload = {
    email :string
}

export async function generateJwtToken(payload: TPayload,jwtService: JwtService){
const jwtToken = await jwtService.signAsync(payload)

return {
    accessToken: jwtToken
}
}
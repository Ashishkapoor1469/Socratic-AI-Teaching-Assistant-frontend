import { modes } from "../type/mode.type"
import { pdf_prompt } from "../prompts/pdf.prompt"
import { research } from "../prompts/research"
import { testPrompt } from "../prompts/test.prompt"
import { TeacherAssistantPrompt } from "../prompts/teacherAssestent"
import { EmailPrompt } from "../prompts/email.prompt"
const deepResearch = require("../prompts/deepSearch.prompt")

export function checkMode(mode: modes): string {
  switch (mode) {
    case modes.pdf:
      return pdf_prompt
    case modes.research:
      return research
    case modes.test:
      return testPrompt
    case modes.email:
      return EmailPrompt
    case modes.deepResearch:
      return deepResearch.deepResearch || deepResearch.default || pdf_prompt
    default:
      return TeacherAssistantPrompt
  }
}

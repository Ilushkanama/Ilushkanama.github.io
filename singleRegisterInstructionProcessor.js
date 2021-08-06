import { LineProcessingResult } from './processingConstants.js'
import { getRegisterCode } from './registerConstants.js'
import { getInstructionCode, toHex } from './instructionConstants.js'

export function processSingleRegisterInstruction(tokens) {
  if (tokens.length !== 2) {
    return {result: LineProcessingResult.error, reason: 'Invalid number of operands'}
  }

  const registerCode = getRegisterCode(tokens[1])
  if (!registerCode) {
    return {result: LineProcessingResult.error, reason: 'Invalid register name'}
  }

  return {
    result: LineProcessingResult.instruction.singleRegister,
    name: tokens[0],
    registerCode: registerCode
  }
}

export function getSingleRegisterInstructionCode(instruction) {
  const instructionCode = getInstructionCode(instruction.name)
  const firstByteCode = instructionCode.substring(0, 4)
  const secondByteCodePart = instructionCode.substring(4)
  const instructionHexCode = toHex(firstByteCode)

  const registerCode = `${secondByteCodePart}${instruction.registerCode}`
  const registerHexCode = toHex(registerCode)

  return `${instructionHexCode}${registerHexCode}`
}

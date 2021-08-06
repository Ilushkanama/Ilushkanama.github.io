import { LineProcessingResult } from './processingConstants.js'
import { getRegisterCode, getRegisterNameWithoutComma } from './registerConstants.js'
import {getInstructionCode, toHex} from './instructionConstants.js'

export function processTwoRegistersInstruction(tokens) {
  if (tokens.length !== 3) {
    return {result: LineProcessingResult.error, reason: 'Invalid number of operands'}
  }

  const firstRegisterName = getRegisterNameWithoutComma(tokens[1])
  const firstRegisterCode = getRegisterCode(firstRegisterName)
  const secondRegisterName = tokens[2]
  const secondRegisterCode = getRegisterCode(secondRegisterName)

  if (!firstRegisterCode || !secondRegisterCode) {
    return {result: LineProcessingResult.error, reason: 'Invalid register name'}
  }

  return {
    result: LineProcessingResult.instruction.twoRegisters,
    name: tokens[0],
    firstRegisterCode: firstRegisterCode,
    secondRegisterCode: secondRegisterCode
  }
}

export function getTwoRegistersInstructionCode(instruction) {
  const instructionCode = getInstructionCode(instruction.name)
  const instructionHexCode = toHex(instructionCode)

  const registersHexCode = toHex(`${instruction.firstRegisterCode}${instruction.secondRegisterCode}`)
  return `${instructionHexCode}${registersHexCode}`
}

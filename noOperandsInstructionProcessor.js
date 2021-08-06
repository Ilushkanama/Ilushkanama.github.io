import { getInstructionCode, toHex } from './instructionConstants.js'
import { LineProcessingResult } from './processingConstants.js'

export function processNoOperandsInstruction(tokens) {
  if (tokens.length !== 1) {
    return {result: LineProcessingResult.error, reason: 'Instruction doesn\'t expect any operands'}
  }

  return {
    result: LineProcessingResult.instruction.noOperands,
    name: tokens[0]
  }
}

export function getNoOperandsInstructionCode(instruction) {
  const instructionCode = getInstructionCode(instruction.name)
  const firstByteCode = instructionCode.substring(0, 4)
  const secondByteCode = instructionCode.substring(4)
  return `${toHex(firstByteCode)}${toHex(secondByteCode)}`
}

import { InstructionNames } from './instructionConstants.js'
import { LineProcessingResult } from './processingConstants.js'
import { processSingleRegisterInstruction, getSingleRegisterInstructionCode } from './singleRegisterInstructionProcessor.js'
import { processTwoRegistersInstruction, getTwoRegistersInstructionCode } from './twoRegistersInstructionProcessor.js'
import { processConstantInstruction, getConstantInstructionCode } from './constantInstructionProcessor.js'
import { processNoOperandsInstruction, getNoOperandsInstructionCode } from './noOperandsInstructionProcessor.js'

const singleRegisterInstructions = [
  InstructionNames.increment,
  InstructionNames.jumpToRegister,
  InstructionNames.shiftLeft,
  InstructionNames.shiftRight,
  InstructionNames.test
]

const twoRegistersInstructions = [
  InstructionNames.add,
  InstructionNames.sub,
  InstructionNames.store,
  InstructionNames.read
]

const constantInstructions = [
  InstructionNames.load,
  InstructionNames.jump,
  InstructionNames.jumpIfNegative
]

const noOperandsInstructions = [
  InstructionNames.stop
]

export function processInstructionTokens(tokens) {
  const instructionName = tokens[0]

  if (singleRegisterInstructions.includes(instructionName)) {
    return processSingleRegisterInstruction(tokens)
  }

  if (twoRegistersInstructions.includes(instructionName)) {
    return processTwoRegistersInstruction(tokens)
  }

  if (constantInstructions.includes(instructionName)) {
    return processConstantInstruction(tokens)
  }

  if (noOperandsInstructions.includes(instructionName)) {
    return processNoOperandsInstruction(tokens)
  }

  return {result: LineProcessingResult.error, reason: 'Unknown instruction'}
}

export function getInstructionCode(line) {
  switch (line.result) {
    case LineProcessingResult.instruction.singleRegister:
      return getSingleRegisterInstructionCode(line)
    case LineProcessingResult.instruction.twoRegisters:
      return getTwoRegistersInstructionCode(line)
    case LineProcessingResult.instruction.constant:
      return getConstantInstructionCode(line)
    case LineProcessingResult.instruction.noOperands:
      return getNoOperandsInstructionCode(line)
    default:
      throw 'Tried to get code of an unknown instruction'
  }
}

import { LineProcessingResult } from './processingConstants.js'
import { getRegisterCode } from './registerConstants.js'
import { InstructionNames, getInstructionCode, toHex } from './instructionConstants.js'
import { processTwoRegistersInstruction, getTwoRegistersInstructionCode } from './twoRegistersInstructionProcessor.js'

const validResult = processTwoRegistersInstruction([InstructionNames.add, 'r0,', 'r1'])
if (validResult.result !== LineProcessingResult.instruction.twoRegisters) {
  throw 'Instruction not recognized'
}

if (validResult.name !== InstructionNames.add) {
  throw 'Instruction name is incorrect'
}

if (validResult.firstRegisterCode !== getRegisterCode('r0')) {
  throw 'Register code is incorrect'
}

if (validResult.secondRegisterCode !== getRegisterCode('r1')) {
  throw 'Register code is incorrect'
}

const validCode = getTwoRegistersInstructionCode(validResult)
if (validCode !== '01') {
  throw 'Instruction code is incorrect'
}

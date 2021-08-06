import { LineProcessingResult } from './processingConstants.js'
import { getRegisterCode } from './registerConstants.js'
import { InstructionNames } from './instructionConstants.js'
import { processSingleRegisterInstruction, getSingleRegisterInstructionCode } from './singleRegisterInstructionProcessor.js'

const validResult = processSingleRegisterInstruction([InstructionNames.increment, 'r3'])
if (validResult.result !== LineProcessingResult.instruction.singleRegister) {
  throw 'Instruction not recognized'
}

if (validResult.name !== InstructionNames.increment) {
  throw 'Instruction name is incorrect'
}

if (validResult.registerCode !== getRegisterCode('r3')) {
  throw 'Register code is incorrect'
}

const validCode = getSingleRegisterInstructionCode(validResult)
if (validCode !== '23') {
  throw 'Instruction code is incorrect'
}

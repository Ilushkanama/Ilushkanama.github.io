import { InstructionNames } from './instructionConstants.js'
import { processNoOperandsInstruction, getNoOperandsInstructionCode } from './noOperandsInstructionProcessor.js'
import { assertTrue } from './testAssertions.js'

function checkInstruction() {
  const result = processNoOperandsInstruction([InstructionNames.stop])
  assertTrue(result.name === InstructionNames.stop, 'Instruction not recognized')

  const code = getNoOperandsInstructionCode(result)
  assertTrue(code === '80', 'Invalid instruction code')
}

checkInstruction()

import { LineProcessingResult } from './processingConstants.js'
import { getRegisterCode } from './registerConstants.js'
import { InstructionNames } from './instructionConstants.js'
import {processConstantInstruction, getConstantInstructionCode, replaceLabelWithAddress} from './constantInstructionProcessor.js'
import {assertTrue} from './testAssertions.js'

function checkBinaryConstant() {
  const result = processConstantInstruction([InstructionNames.load, 'r3,', '0b1001'])
  assertTrue(result.result === LineProcessingResult.instruction.constant, 'Instruction not recognized')
  assertTrue(result.name === InstructionNames.load, 'Instruction name is incorrect')
  assertTrue(result.registerCode === getRegisterCode('r3'), 'Register code is incorrect')
  assertTrue(result.constant === '00 09', 'Constant value is incorrect')
  
  const code = getConstantInstructionCode(result)
  assertTrue(code === `93 00 09`, 'Instruction code is incorrect')
}

function checkHexConstant() {
  const result = processConstantInstruction([InstructionNames.load, 'r3,', '0x10'])
  assertTrue(result.result === LineProcessingResult.instruction.constant, 'Instruction not recognized')
  assertTrue(result.name === InstructionNames.load, 'Instruction name is incorrect')
  assertTrue(result.registerCode === getRegisterCode('r3'), 'Register code is incorrect')
  assertTrue(result.constant === '00 10', 'Constant value is incorrect')
  
  const code = getConstantInstructionCode(result)
  assertTrue(code === `93 00 10`, 'Instruction code is incorrect')
}

function checkDecimalConstant() {
  const result = processConstantInstruction([InstructionNames.load, 'r3,', '11'])
  assertTrue(result.result === LineProcessingResult.instruction.constant, 'Instruction not recognized')
  assertTrue(result.name === InstructionNames.load, 'Instruction name is incorrect')
  assertTrue(result.registerCode === getRegisterCode('r3'), 'Register code is incorrect')
  assertTrue(result.constant === '00 0b', 'Constant value is incorrect')
  
  const code = getConstantInstructionCode(result)
  assertTrue(code === `93 00 0b`, 'Instruction code is incorrect')
}

function checkInvalidConstant() {
  const negativeOutOfBoundsResult = processConstantInstruction([InstructionNames.load, 'r3,', '-40000'])
  assertTrue(!negativeOutOfBoundsResult.constant, 'Constant is defined when it shouldn\'t be')
  assertTrue(negativeOutOfBoundsResult.label === '-40000', 'Label value is incorrect')

  const positiveOutOfBoundsResult = processConstantInstruction([InstructionNames.load, 'r3,', '40000'])
  assertTrue(!positiveOutOfBoundsResult.constant, 'Constant is defined when it shouldn\'t be')
  assertTrue(positiveOutOfBoundsResult.label === '40000', 'Label value is incorrect')
}

function checkLabel() {
  const result = processConstantInstruction([InstructionNames.load, 'r3,', 'label'])
  assertTrue(!result.constant, 'Constant is defined when it shouldn\'t be')
  assertTrue(result.label === 'label', 'Label value is incorrect')
}

function checkLabelReplacement() {
  const result = processConstantInstruction([InstructionNames.load, 'r3,', 'label'])
  const replacementResult = replaceLabelWithAddress(result, 16)
  assertTrue(replacementResult.constant === '00 10', 'Replaced label value is incorrect')
}

function checkNoRegisterInstruction() {
  const result = processConstantInstruction([InstructionNames.jump, '16'])
  assertTrue(result.constant === '00 10', 'Constant value is incorrect')

  const code = getConstantInstructionCode(result)
  assertTrue(code === 'a0 00 10', 'Instruction code is incorrect')
}

checkBinaryConstant()
checkHexConstant()
checkDecimalConstant()
checkInvalidConstant()
checkLabel()
checkLabelReplacement()
checkNoRegisterInstruction()

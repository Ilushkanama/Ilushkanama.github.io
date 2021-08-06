import { getInstructionCode, toHex } from './instructionConstants.js'
import { LineProcessingResult } from './processingConstants.js'
import { getRegisterNameWithoutComma } from './registerConstants.js'
import { processSingleRegisterInstruction, getSingleRegisterInstructionCode } from './singleRegisterInstructionProcessor.js'

const binaryConstantPrefix = '0b'
const hexConstantPrefix = '0x'

export function processConstantInstruction(tokens) {
  const hasRegister = tokens.length === 3
  const registerName = hasRegister ? getRegisterNameWithoutComma(tokens[1]) : null
  const instruction = hasRegister 
                        ? processSingleRegisterInstruction([tokens[0], registerName])
                        : {result: LineProcessingResult.instruction.constant, name: tokens[0]}
  const constant = hasRegister ? tokens[2] : tokens[1]
  let decimalValue = undefined

  if (constant.startsWith(binaryConstantPrefix)) {
    decimalValue = processBinaryConstant(constant)
  }
  else if (constant.startsWith(hexConstantPrefix)) {
    decimalValue = processHexConstant(constant)
  }
  else {
    decimalValue = processDecimalConstant(constant)
  }

  if (!validateDecimalConstant(decimalValue)) {
    // if it's not a true constant, it's a label
    // if no such label exists, we will fail later
    //
    return {...instruction, result: LineProcessingResult.instruction.constant, label: constant}
  }

  return {...instruction, result: LineProcessingResult.instruction.constant, constant: convertToHex(decimalValue)}
}

function processBinaryConstant(constant) {
  const binaryNumber = constant.substring(2, constant.length)
  return parseInt(binaryNumber, 2)
}

function processHexConstant(constant) {
  const hexNumber = constant.substring(2, constant.length)
  return parseInt(hexNumber, 16)
}

function processDecimalConstant(constant) {
  return parseInt(constant, 10)
}

function validateDecimalConstant(constant) {
  return constant !== undefined && constant >= -32768 && constant <= 32768
}

function convertToHex(decimalValue) {
  const hexValue = convertToTwosComplement(decimalValue)
                    .toString(16)
                    .padStart(4, '0')
  return hexValue.substring(0, 2) + ' ' + hexValue.substring(2, hexValue.length)
}

function convertToTwosComplement(constant) {
  return constant < 0
    ? 2**16 + constant
    : constant
}

export function replaceLabelWithAddress(line, address) {
  if (validateDecimalConstant(address)) {
    return {...line, constant: convertToHex(address)}
  }
  else {
    return {result: LineProcessingResult.error, reason: 'Label address is invalid'}
  }
}

export function getConstantInstructionCode(instruction) {
  const hasRegister = instruction.registerCode !== undefined
  const instructionCode = hasRegister ? getSingleRegisterInstructionCode(instruction) : getHexInstructionCode(instruction.name)
  return `${instructionCode} ${instruction.constant}`
}

function getHexInstructionCode(instructionName) {
  const binaryCode = getInstructionCode(instructionName)
  const firstPart = binaryCode.substring(0, 4)
  const secondPart = binaryCode.substring(4, binaryCode.length)

  return `${toHex(firstPart)}${toHex(secondPart)}`
}

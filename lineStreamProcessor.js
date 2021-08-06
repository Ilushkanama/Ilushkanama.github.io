import { InstructionSizes } from './instructionConstants.js'
import { LineProcessingResult } from './processingConstants.js'
import { processInstructionTokens, getInstructionCode } from './singleInstructionProcessor.js'
import { replaceLabelWithAddress } from './constantInstructionProcessor.js'
import { isLabelDefinition, processLabel } from './labelProcessor.js'

const CommentDelimiter = ';'
const InvalidSearchPosition = -1

export function processLines(lines) {
  let processedLines = []
  let labels = {}
  let address = 0
  let haveErrors = false

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const processedLine = {...processSingleLine(line), text: line}
    
    if (processedLine.result === LineProcessingResult.error) {
      processedLines.push(processedLine)
      haveErrors = true
    }
    else {
      processedLines.push({...processedLine, address: address})
      
      switch (processedLine.result) {
        case LineProcessingResult.label:
          labels[processedLine.name] = address
          break
        case LineProcessingResult.instruction.singleRegister:
        case LineProcessingResult.instruction.twoRegisters:
        case LineProcessingResult.instruction.noOperands:
          address += InstructionSizes.regular
          break
        case LineProcessingResult.instruction.constant:
          address += InstructionSizes.constant
          break
      }
    }
  }

  if (haveErrors) {
    return {lines: processedLines}
  }

  haveErrors = false

  const finalizedLines = processedLines.map(line => {
    if (line.result === LineProcessingResult.instruction.constant && line.label) {
      const labelAddress = labels[line.label]
      if (labelAddress !== undefined) {
        return replaceLabelWithAddress(line, labelAddress)
      }
      else {
        haveErrors = true
        return {result: LineProcessingResult.error, text: line.text, reason: 'Label not found'}
      }
    }
    else {
      return line
    }
  })

  if (haveErrors) {
    return {lines: finalizedLines}
  }

  const machineCode = finalizedLines
    .map(line => {
      switch (line.result) {
        case LineProcessingResult.ignored:
        case LineProcessingResult.label:
          return null
        default:
          return getInstructionCode(line)
      }
    })
    .filter(code => code !== null)
    .join(' ')

  return {lines: finalizedLines, machineCode: machineCode}
}

function processSingleLine(line) {
  const cleanLine = line.trim()
  const commentStart = cleanLine.search(CommentDelimiter)
  console.log(commentStart)
  const lineWithoutComments = commentStart === InvalidSearchPosition
                                ? cleanLine
                                : cleanLine.substring(0, commentStart).trim()
  console.log(lineWithoutComments)
  if (lineWithoutComments.length === 0) {
    return {result: LineProcessingResult.ignored}
  }

  const tokens = lineWithoutComments.split(' ')
  if (tokens.length === 1 && isLabelDefinition(tokens)) {
    return processLabel(tokens)
  }
  else {
    return processInstructionTokens(tokens)
  }
}

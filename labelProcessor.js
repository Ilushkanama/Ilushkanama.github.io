import { LineProcessingResult } from './processingConstants.js'

const LabelSuffix = ':'

export function isLabelDefinition(tokens) {
  if (tokens.length !== 1) {
    return false
  }

  const firstToken = tokens[0]
  return firstToken[firstToken.length-1] === LabelSuffix
}

export function processLabel(tokens) {
  const firstToken = tokens[0]
  const labelName = firstToken.substring(0, firstToken.length-1)

  if (labelName.length === 0) {
    return {result: LineProcessingResult.error, reason: 'Empty label name'}
  }
  else {
    return {result: LineProcessingResult.label, name: labelName}
  }
}

import { isLabelDefinition, processLabel } from "./labelProcessor"
import { LineProcessingResult } from "./processingConstants"

const validLabelTokens = ['label:']

if (!isLabelDefinition(validLabelTokens)) {
  throw 'Label not recognized'
}

const validLabelResult = processLabel(validLabelTokens)
if (validLabelResult.result !== LineProcessingResult.label) {
  throw 'Label not recognized'
}

if (validLabelResult.name !== 'label') {
  throw 'Label name is invalid'
}

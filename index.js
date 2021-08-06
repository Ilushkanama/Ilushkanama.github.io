import { processLines } from './lineStreamProcessor.js'
import { LineProcessingResult } from './processingConstants.js'

function handleFileSelect(event) {
  if (event.target.files.length == 0) {
    return
  }

  const file = event.target.files[0]
  if (file.size > 2**20) {
    alert('This file is too big (maybe you selected a wrong one?)')
    return
  }

  const reader = new FileReader()
  reader.onload = handleFile
  reader.readAsText(file)
}

function handleFile(file) {
  if (file.total !== file.loaded) {
    return
  }

  processFileContents(file.target.result)
}

function processFileContents(fileContents) {
  const lines = fileContents.split('\n').filter(line => line.length > 0)
  const result = processLines(lines)
  displayResult(result)
}

function displayResult({machineCode, lines}) {
  const div = document.querySelector('div')
  if (machineCode) {
    const machineCodeText = document.createTextNode(machineCode)
    div.appendChild(machineCodeText)
  }
  else {
    const errorText = document.createTextNode('Failed to transform the program into machine code')
    div.appendChild(errorText)
  }

  const table = document.querySelector('table')
  
  const header = table.createTHead()
  const headerRow = header.insertRow()
  const columnNames = ['address', 'text', 'label', 'instruction', 'operand1', 'operand2', 'error']
  for (let index = 0; index < columnNames.length; index++) {
    const columnHeader = document.createElement("th");
    const text = document.createTextNode(columnNames[index]);
    columnHeader.appendChild(text);
    headerRow.appendChild(columnHeader);
  }

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const row = table.insertRow()

    const addressCell = row.insertCell()
    const addressText = document.createTextNode(line.address !== undefined ? line.address : '')
    addressCell.appendChild(addressText)

    const textCell = row.insertCell()
    const textText = document.createTextNode(line.text)
    textCell.appendChild(textText)

    switch (line.result) {
      case LineProcessingResult.label:
        populateLabelRow(row, line)
        break
      case LineProcessingResult.error:
        populateErrorRow(row, line)
        break
      case LineProcessingResult.ignored:
        break
      default:
        populateInstructionRow(row, line)
    }
  }
}

function populateLabelRow(row, line) {
  const labelCell = row.insertCell()
  const labelText = document.createTextNode(line.name)
  labelCell.appendChild(labelText)
}

function populateErrorRow(row, line) {
  // label is empty
  row.insertCell()
  // instruction is empty
  row.insertCell()
  // operand1 is empty
  row.insertCell()
  // operand2 is empty
  row.insertCell()

  const errorCell = row.insertCell()
  const errorText = document.createTextNode(line.reason)
  errorCell.appendChild(errorText)
}

function populateInstructionRow(row, line) {
  // label is empty
  row.insertCell()
  
  const instructionCell = row.insertCell()
  const instructionText = document.createTextNode(line.name)
  instructionCell.appendChild(instructionText)

  switch (line.result) {
    case LineProcessingResult.instruction.singleRegister:
      populateSingleRegisterInstructionRow(row, line)
      break
    case LineProcessingResult.instruction.twoRegisters:
      populateTwoRegistersInstructionRow(row, line)
      break
    case LineProcessingResult.instruction.constant:
      populateConstantInstructionRow(row, line)
      break
  }
}

function populateSingleRegisterInstructionRow(row, line) {
  const registerCell = row.insertCell()
  const registerText = document.createTextNode(line.registerCode)
  registerCell.appendChild(registerText)
}

function populateTwoRegistersInstructionRow(row, line) {
  const firstRegisterCell = row.insertCell()
  const firstRegisterText = document.createTextNode(line.firstRegisterCode)
  firstRegisterCell.appendChild(firstRegisterText)

  const secondRegisterCell = row.insertCell()
  const secondRegisterText = document.createTextNode(line.secondRegisterCode)
  secondRegisterCell.appendChild(secondRegisterText)
}

function populateConstantInstructionRow(row, line) {
  if (line.registerCode) {
    populateSingleRegisterInstructionRow(row, line) 
  }

  const constantCell = row.insertCell()
  const constantText = document.createTextNode(line.constant)
  constantCell.appendChild(constantText)
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);

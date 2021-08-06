export const InstructionNames = {
  add: 'add',
  sub: 'sub',
  store: 'store',
  read: 'read',
  load: 'load',
  jump: 'jmp',
  shiftRight: 'shr',
  shiftLeft: 'shl',
  increment: 'inc',
  jumpToRegister: 'jmpr',
  stop: 'stop'
}

const InstructionCodes = {
  [InstructionNames.add]: '0000',
  [InstructionNames.sub]: '0001',
  [InstructionNames.store]: '1011',
  [InstructionNames.read]: '1100',
  [InstructionNames.load]: '100100',
  [InstructionNames.jump]: '10100000',
  [InstructionNames.increment]: '001000',
  [InstructionNames.jumpToRegister]: '101010',
  [InstructionNames.stop]: '10000000'
}

export function getInstructionCode(instructionName) {
  return InstructionCodes[instructionName]
}

export function toHex(binary) {
  switch (binary) {
    case '0000': return '0'
    case '0001': return '1'
    case '0010': return '2'
    case '0011': return '3'
    case '0100': return '4'
    case '0101': return '5'
    case '0110': return '6'
    case '0111': return '7'
    case '1000': return '8'
    case '1001': return '9'
    case '1010': return 'a'
    case '1011': return 'b'
    case '1100': return 'c'
    case '1101': return 'd'
    case '1110': return 'e'
    case '1111': return 'f'
  }

  console.log('Invalid binary number to hex conversion: ' + binary)
  throw {}
}

export const InstructionSizes = {
  regular: 1,
  constant: 3
}

const RegisterCodes = {
  'r0': '00',
  'r1': '01',
  'r2': '10',
  'r3': '11'
}

export function getRegisterCode(registerName) {
  return RegisterCodes[registerName]
}

export function getRegisterNameWithoutComma(registerName) {
  return registerName.substring(0, registerName.length-1)
}

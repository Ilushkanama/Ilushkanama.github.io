import { processLines } from "./lineStreamProcessor"
import { assertTrue } from "./testAssertions"

function checkWithoutLabels() {
  const result = processLines(['start:', 'add r0, r0', 'inc r0 ; increment'])
  assertTrue(result.machineCode === '00 20', 'Invalid machine code')
}

function checkWithLabels() {
  const result = processLines(['start:', 'jmp start', 'finish:', 'jmp finish', 'sub r0, r0'])
  assertTrue(result.machineCode === 'a0 00 00 a0 00 03 10', 'Invalid machine code')
}

checkWithoutLabels()
checkWithLabels()
